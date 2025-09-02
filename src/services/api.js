/**
 * API service for TraitSniffer application
 * This service handles all API calls to the backend
 */

import { supabase } from '../lib/supabase';
import * as pinataService from '../lib/pinata';

/**
 * Base API class with common methods
 */
class BaseAPI {
  /**
   * Handle API errors
   * @param {Error} error - The error object
   * @returns {Object} - Standardized error response
   */
  static handleError(error) {
    console.error('API Error:', error);
    
    return {
      success: false,
      error: error.message || 'An unknown error occurred',
      data: null
    };
  }
  
  /**
   * Format successful response
   * @param {any} data - The response data
   * @returns {Object} - Standardized success response
   */
  static formatResponse(data) {
    return {
      success: true,
      error: null,
      data
    };
  }
}

/**
 * User API service
 */
export class UserAPI extends BaseAPI {
  /**
   * Get user profile
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - User profile data
   */
  static async getProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      
      return this.formatResponse(data);
    } catch (error) {
      return this.handleError(error);
    }
  }
  
  /**
   * Update user profile
   * @param {string} userId - User ID
   * @param {Object} updates - Profile updates
   * @returns {Promise<Object>} - Updated profile data
   */
  static async updateProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      
      return this.formatResponse(data);
    } catch (error) {
      return this.handleError(error);
    }
  }
}

/**
 * Upload API service
 */
export class UploadAPI extends BaseAPI {
  /**
   * Upload a FASTA file
   * @param {string} userId - User ID
   * @param {File} file - FASTA file
   * @param {Object} metadata - File metadata
   * @returns {Promise<Object>} - Upload result
   */
  static async uploadFastaFile(userId, file, metadata = {}) {
    try {
      // Upload file to Pinata
      const pinataResult = await pinataService.uploadFileToPinata(
        file,
        `${userId}_${Date.now()}`,
        metadata
      );
      
      if (!pinataResult.success) {
        throw new Error(pinataResult.error || 'Failed to upload file to storage');
      }
      
      // Save upload record in Supabase
      const { data, error } = await supabase
        .from('uploads')
        .insert([{
          user_id: userId,
          filename: file.name,
          file_size: file.size,
          ipfs_hash: pinataResult.ipfsHash,
          metadata: {
            ...metadata,
            contentType: file.type,
            timestamp: new Date().toISOString()
          }
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      return this.formatResponse({
        upload: data,
        storage: pinataResult
      });
    } catch (error) {
      return this.handleError(error);
    }
  }
  
  /**
   * Get user uploads
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - User uploads
   */
  static async getUserUploads(userId) {
    try {
      const { data, error } = await supabase
        .from('uploads')
        .select(`
          *,
          results (*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return this.formatResponse(data);
    } catch (error) {
      return this.handleError(error);
    }
  }
  
  /**
   * Get upload by ID
   * @param {string} uploadId - Upload ID
   * @returns {Promise<Object>} - Upload data
   */
  static async getUploadById(uploadId) {
    try {
      const { data, error } = await supabase
        .from('uploads')
        .select(`
          *,
          results (*)
        `)
        .eq('id', uploadId)
        .single();
      
      if (error) throw error;
      
      return this.formatResponse(data);
    } catch (error) {
      return this.handleError(error);
    }
  }
  
  /**
   * Delete upload
   * @param {string} uploadId - Upload ID
   * @param {string} ipfsHash - IPFS hash for the file
   * @returns {Promise<Object>} - Delete result
   */
  static async deleteUpload(uploadId, ipfsHash) {
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('uploads')
        .delete()
        .eq('id', uploadId);
      
      if (error) throw error;
      
      // Delete from Pinata if hash is provided
      if (ipfsHash) {
        await pinataService.unpinFromPinata(ipfsHash);
      }
      
      return this.formatResponse({ success: true });
    } catch (error) {
      return this.handleError(error);
    }
  }
}

/**
 * Analysis API service
 */
export class AnalysisAPI extends BaseAPI {
  /**
   * Save analysis results
   * @param {string} uploadId - Upload ID
   * @param {Object} results - Analysis results
   * @returns {Promise<Object>} - Saved results
   */
  static async saveResults(uploadId, results) {
    try {
      const { data, error } = await supabase
        .from('results')
        .insert([{
          upload_id: uploadId,
          traits: results.traits,
          markers: results.markers,
          sequence_length: results.sequenceLength,
          analysis_date: results.analysisDate || new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      return this.formatResponse(data);
    } catch (error) {
      return this.handleError(error);
    }
  }
  
  /**
   * Get analysis results by ID
   * @param {string} resultId - Result ID
   * @returns {Promise<Object>} - Analysis results
   */
  static async getResultById(resultId) {
    try {
      const { data, error } = await supabase
        .from('results')
        .select(`
          *,
          upload:upload_id (
            id,
            filename,
            file_size,
            ipfs_hash,
            created_at
          )
        `)
        .eq('id', resultId)
        .single();
      
      if (error) throw error;
      
      return this.formatResponse(data);
    } catch (error) {
      return this.handleError(error);
    }
  }
  
  /**
   * Get results by upload ID
   * @param {string} uploadId - Upload ID
   * @returns {Promise<Object>} - Analysis results
   */
  static async getResultsByUploadId(uploadId) {
    try {
      const { data, error } = await supabase
        .from('results')
        .select('*')
        .eq('upload_id', uploadId);
      
      if (error) throw error;
      
      return this.formatResponse(data);
    } catch (error) {
      return this.handleError(error);
    }
  }
  
  /**
   * Delete analysis results
   * @param {string} resultId - Result ID
   * @returns {Promise<Object>} - Delete result
   */
  static async deleteResult(resultId) {
    try {
      const { error } = await supabase
        .from('results')
        .delete()
        .eq('id', resultId);
      
      if (error) throw error;
      
      return this.formatResponse({ success: true });
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export default {
  user: UserAPI,
  upload: UploadAPI,
  analysis: AnalysisAPI
};
