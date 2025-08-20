// config/supabaseClient.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config()
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET; // Not anon key!
export const supabase = createClient(supabaseUrl, supabaseKey);