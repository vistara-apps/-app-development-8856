import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase credentials are missing. Make sure to set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authentication helpers
export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  return { data, error };
};

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

// Database helpers
export const createUserProfile = async (userId, userData) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert([{ id: userId, ...userData }]);
  
  return { data, error };
};

export const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  return { data, error };
};

export const updateUserProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);
  
  return { data, error };
};

// Upload helpers
export const saveUpload = async (userId, uploadData) => {
  const { data, error } = await supabase
    .from('uploads')
    .insert([{ user_id: userId, ...uploadData }]);
  
  return { data, error };
};

export const getUserUploads = async (userId) => {
  const { data, error } = await supabase
    .from('uploads')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  return { data, error };
};

export const getUploadById = async (uploadId) => {
  const { data, error } = await supabase
    .from('uploads')
    .select('*')
    .eq('id', uploadId)
    .single();
  
  return { data, error };
};

export const deleteUpload = async (uploadId) => {
  const { data, error } = await supabase
    .from('uploads')
    .delete()
    .eq('id', uploadId);
  
  return { data, error };
};

// Results helpers
export const saveResults = async (uploadId, resultsData) => {
  const { data, error } = await supabase
    .from('results')
    .insert([{ upload_id: uploadId, ...resultsData }]);
  
  return { data, error };
};

export const getResultsByUploadId = async (uploadId) => {
  const { data, error } = await supabase
    .from('results')
    .select('*')
    .eq('upload_id', uploadId)
    .single();
  
  return { data, error };
};

export default supabase;
