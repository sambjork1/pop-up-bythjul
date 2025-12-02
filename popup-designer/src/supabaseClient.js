import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wpvejgybuwpbyfecwtqk.supabase.co'  // 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwdmVqZ3lidXdwYnlmZWN3dHFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MzY5MjIsImV4cCI6MjA4MDIxMjkyMn0.eidi-zuf0H86cDZv_Sd_pxk5Ne-j9GtxIcyDQpONltU'   // Från samma ställe

export const supabase = createClient(supabaseUrl, supabaseAnonKey)