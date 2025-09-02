/**
 * Storage service for TraitSniffer application
 * This service handles file storage operations using Pinata IPFS
 */

import * as pinataService from '../lib/pinata';

/**
 * Upload a file to IPFS via Pinata
 * @param {File} file - The file to upload
 * @param {string} name - Name to identify the file
 * @param {Object} metadata - Additional metadata for the file
 * @returns {Promise<Object>} - Upload result
 */
export const uploadFile = async (file, name, metadata = {}) => {
  try {
    const result = await pinataService.uploadFileToPinata(file, name, metadata);
    
    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Failed to upload file',
        data: null
      };
    }
    
    return {
      success: true,
      error: null,
      data: {
        ipfsHash: result.ipfsHash,
        pinSize: result.pinSize,
        timestamp: result.timestamp,
        gatewayUrl: pinataService.getIpfsGatewayUrl(result.ipfsHash)
      }
    };
  } catch (error) {
    console.error('File upload error:', error);
    return {
      success: false,
      error: error.message || 'An error occurred during file upload',
      data: null
    };
  }
};

/**
 * Get file metadata from Pinata
 * @param {string} ipfsHash - The IPFS hash of the file
 * @returns {Promise<Object>} - File metadata
 */
export const getFileMetadata = async (ipfsHash) => {
  try {
    const result = await pinataService.getPinataMetadata(ipfsHash);
    
    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Failed to get file metadata',
        data: null
      };
    }
    
    return {
      success: true,
      error: null,
      data: result.metadata
    };
  } catch (error) {
    console.error('Get file metadata error:', error);
    return {
      success: false,
      error: error.message || 'An error occurred while getting file metadata',
      data: null
    };
  }
};

/**
 * Delete a file from Pinata
 * @param {string} ipfsHash - The IPFS hash of the file to delete
 * @returns {Promise<Object>} - Delete result
 */
export const deleteFile = async (ipfsHash) => {
  try {
    const result = await pinataService.unpinFromPinata(ipfsHash);
    
    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Failed to delete file',
        data: null
      };
    }
    
    return {
      success: true,
      error: null,
      data: { message: result.message }
    };
  } catch (error) {
    console.error('Delete file error:', error);
    return {
      success: false,
      error: error.message || 'An error occurred while deleting the file',
      data: null
    };
  }
};

/**
 * Fetch a file from IPFS
 * @param {string} ipfsHash - The IPFS hash of the file
 * @returns {Promise<Object>} - File content
 */
export const fetchFile = async (ipfsHash) => {
  try {
    const result = await pinataService.fetchFromIpfs(ipfsHash);
    
    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Failed to fetch file',
        data: null
      };
    }
    
    return {
      success: true,
      error: null,
      data: {
        content: result.content,
        gatewayUrl: pinataService.getIpfsGatewayUrl(ipfsHash)
      }
    };
  } catch (error) {
    console.error('Fetch file error:', error);
    return {
      success: false,
      error: error.message || 'An error occurred while fetching the file',
      data: null
    };
  }
};

/**
 * Get the IPFS gateway URL for a file
 * @param {string} ipfsHash - The IPFS hash of the file
 * @returns {string} - The gateway URL
 */
export const getGatewayUrl = (ipfsHash) => {
  return pinataService.getIpfsGatewayUrl(ipfsHash);
};

export default {
  uploadFile,
  getFileMetadata,
  deleteFile,
  fetchFile,
  getGatewayUrl
};
