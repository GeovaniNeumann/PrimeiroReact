import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tytuqrvttcmzbpbjxwfa.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5dHVxcnZ0dGNtemJwYmp4d2ZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzMDA0NzMsImV4cCI6MjA4Nzg3NjQ3M30.I_8xXNqcaSoVBgSi7mmw1JqiP2N64YSVnvI-zU2Uw-0'

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})