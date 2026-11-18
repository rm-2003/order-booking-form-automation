import { createClient, SupabaseClient } from '@supabase/supabase-js';
import config from './config';

// Initialize Supabase client with service role key
const supabase: SupabaseClient = createClient(
  config.supabase.url,
  config.supabase.serviceRoleKey
);

// Helper functions for CRUD operations
const getAllRecords = async <T>(table: string): Promise<T[]> => {
  const { data, error } = await supabase
    .from(table)
    .select('*');
  
  if (error) throw error;
  return data as T[];
};

const getRecordById = async <T>(table: string, recordId: string): Promise<T> => {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('id', recordId)
    .single();
  
  if (error) throw error;
  return data as T;
};

const createRecord = async <T>(table: string, data: Partial<T>): Promise<T> => {
  const { data: newRecord, error } = await supabase
    .from(table)
    .insert(data)
    .select();
  
  if (error) throw error;
  return newRecord[0] as T;
};

const updateRecord = async <T>(table: string, recordId: string, data: Partial<T>): Promise<T> => {
  const { data: updatedRecord, error } = await supabase
    .from(table)
    .update(data)
    .eq('id', recordId)
    .select();
  
  if (error) throw error;
  return updatedRecord[0] as T;
};

const deleteRecord = async <T>(table: string, recordId: string): Promise<T> => {
  const { data: deletedRecord, error } = await supabase
    .from(table)
    .delete()
    .eq('id', recordId)
    .select();
  
  if (error) throw error;
  return deletedRecord[0] as T;
};

export {
  supabase,
  getAllRecords,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord
}; 