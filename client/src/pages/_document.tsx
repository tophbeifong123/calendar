import { Html, Head, Main, NextScript } from "next/document";
import { createClient } from "@supabase/supabase-js";
import { SessionContextProvider } from "@supabase/auth-helpers-react";

export default function Document() {
  const supabase = createClient(
    "https://zjzzsrjcmcwqdjzuhqal.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqenpzcmpjbWN3cWRqenVocWFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI2NjkxNTUsImV4cCI6MjAyODI0NTE1NX0.p1hYda8iwBFHOkE-c0z9oJqXLR8RbNw_H5rAbfYCagg"
  );

  return (
    <Html lang="en">
      <Head />
      <body>
        <SessionContextProvider supabaseClient={supabase}>
          <Main />
          <NextScript />
        </SessionContextProvider>
      </body>
    </Html>
  );
}
