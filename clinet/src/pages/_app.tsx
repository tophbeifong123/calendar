import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { createClient } from '@supabase/supabase-js';
import { SessionContextProvider } from '@supabase/auth-helpers-react';

// Create Supabase client instance
const supabase = createClient(
  "https://zjzzsrjcmcwqdjzuhqal.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqenpzcmpjbWN3cWRqenVocWFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI2NjkxNTUsImV4cCI6MjAyODI0NTE1NX0.p1hYda8iwBFHOkE-c0z9oJqXLR8RbNw_H5rAbfYCagg" 
);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <Component {...pageProps} />
    </SessionContextProvider>
  );
}
