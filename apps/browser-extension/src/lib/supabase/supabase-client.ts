import { createClient } from '@supabase/supabase-js';

const VITE_SUPABASE_ANON_KEY =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJob3RhbmJrZnpjcXplb2J3cGh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4NzM2NTMsImV4cCI6MjA1NzQ0OTY1M30.xs_aMIDP_E1TRbyV2oxAwsRNd137Jy_JzIy73NnnCvw';
const VITE_SUPABASE_URL = 'https://rhotanbkfzcqzeobwphw.supabase.co';

const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, {
	auth: {
		autoRefreshToken: true,
		persistSession: true,
		detectSessionInUrl: true
	}
});

export default supabase;
