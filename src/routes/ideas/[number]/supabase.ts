import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://wctvoiwfcxtkqfszektb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjdHZvaXdmY3h0a3Fmc3pla3RiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTk5Mzc3NjMsImV4cCI6MTk3NTUxMzc2M30.xtm0EWGkf6JS9hUWU-YaICUpdEBbW54ovWBE16jTpnc'
);
