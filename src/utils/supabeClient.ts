// import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = "https://kfzxgxuhjkpplaihvkqo.supabase.co";
// const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmenhneHVoamtwcGxhaWh2a3FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg3NTE4ODEsImV4cCI6MjA0NDMyNzg4MX0.J5X6vQyydWKN_3-1CyeqEqIn_vMRR1MyigdGxnn4tsA";

// export const supabase = createClient(supabaseUrl, supabaseAnonKey);


import { createBrowserClient } from '@supabase/ssr';

export const supabaseBrowserClient = createBrowserClient(
    "https://kfzxgxuhjkpplaihvkqo.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmenhneHVoamtwcGxhaWh2a3FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg3NTE4ODEsImV4cCI6MjA0NDMyNzg4MX0.J5X6vQyydWKN_3-1CyeqEqIn_vMRR1MyigdGxnn4tsA"
);

