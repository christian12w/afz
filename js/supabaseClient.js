(function() {
    'use strict';

    var SUPABASE_URL = 'https://ogcxahzyqikxgytrlqtl.supabase.co';
    var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nY3hhaHp5cWlreGd5dHJscXRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzOTAyNjgsImV4cCI6MjA3MTk2NjI2OH0.KtdCuzyQ-ZPCd_uT9Y5BX90Th_fa4PpK9d5eYxNS3_A';

    if (!window.supabase || !window.supabase.createClient) {
        console.error('Supabase UMD library not loaded. Ensure the CDN script is included before supabaseClient.js');
        return;
    }

    // Create a global client instance
    window.sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
})();

