/**
 * Authentication service for TraitSniffer application
 * This service handles user authentication and session management
 */

import { supabase } from '../lib/supabase';

/**
 * Sign up a new user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} - Sign up result
 */
export const signUp = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) {
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
    
    // Create user profile if sign up was successful
    if (data?.user) {
      await createUserProfile(data.user.id, {
        email: data.user.email,
        created_at: new Date().toISOString()
      });
    }
    
    return {
      success: true,
      error: null,
      data
    };
  } catch (error) {
    console.error('Sign up error:', error);
    return {
      success: false,
      error: error.message || 'An error occurred during sign up',
      data: null
    };
  }
};

/**
 * Sign in a user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} - Sign in result
 */
export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
    
    return {
      success: true,
      error: null,
      data
    };
  } catch (error) {
    console.error('Sign in error:', error);
    return {
      success: false,
      error: error.message || 'An error occurred during sign in',
      data: null
    };
  }
};

/**
 * Sign out the current user
 * @returns {Promise<Object>} - Sign out result
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return {
        success: false,
        error: error.message
      };
    }
    
    return {
      success: true,
      error: null
    };
  } catch (error) {
    console.error('Sign out error:', error);
    return {
      success: false,
      error: error.message || 'An error occurred during sign out'
    };
  }
};

/**
 * Get the current user
 * @returns {Promise<Object>} - Current user
 */
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      return {
        success: false,
        error: error.message,
        user: null
      };
    }
    
    return {
      success: true,
      error: null,
      user
    };
  } catch (error) {
    console.error('Get current user error:', error);
    return {
      success: false,
      error: error.message || 'An error occurred while getting the current user',
      user: null
    };
  }
};

/**
 * Get the current session
 * @returns {Promise<Object>} - Current session
 */
export const getSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      return {
        success: false,
        error: error.message,
        session: null
      };
    }
    
    return {
      success: true,
      error: null,
      session
    };
  } catch (error) {
    console.error('Get session error:', error);
    return {
      success: false,
      error: error.message || 'An error occurred while getting the session',
      session: null
    };
  }
};

/**
 * Reset password for a user
 * @param {string} email - User email
 * @returns {Promise<Object>} - Password reset result
 */
export const resetPassword = async (email) => {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) {
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
    
    return {
      success: true,
      error: null,
      data
    };
  } catch (error) {
    console.error('Reset password error:', error);
    return {
      success: false,
      error: error.message || 'An error occurred during password reset',
      data: null
    };
  }
};

/**
 * Update user password
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} - Password update result
 */
export const updatePassword = async (newPassword) => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    
    if (error) {
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
    
    return {
      success: true,
      error: null,
      data
    };
  } catch (error) {
    console.error('Update password error:', error);
    return {
      success: false,
      error: error.message || 'An error occurred while updating the password',
      data: null
    };
  }
};

/**
 * Create a user profile
 * @param {string} userId - User ID
 * @param {Object} userData - User profile data
 * @returns {Promise<Object>} - Profile creation result
 */
export const createUserProfile = async (userId, userData) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert([{ id: userId, ...userData }]);
    
    if (error) {
      console.error('Create profile error:', error);
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
    
    return {
      success: true,
      error: null,
      data
    };
  } catch (error) {
    console.error('Create profile error:', error);
    return {
      success: false,
      error: error.message || 'An error occurred while creating the user profile',
      data: null
    };
  }
};

export default {
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  getSession,
  resetPassword,
  updatePassword,
  createUserProfile
};
