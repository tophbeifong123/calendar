import { Html, Head, Main, NextScript } from "next/document";
import { createClient } from "@supabase/supabase-js";
import { SessionContextProvider } from "@supabase/auth-helpers-react";

export default function Document() {
  const supabase = createClient(
    "https://uhuchzacpnfjmarnwhyh.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVodWNoemFjcG5mam1hcm53aHloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI2NTgwNDUsImV4cCI6MjAyODIzNDA0NX0.z_cEnlrJnPh8sH3zUpKTD8cX0GeCIbHDZcFNh87AZpE"
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
