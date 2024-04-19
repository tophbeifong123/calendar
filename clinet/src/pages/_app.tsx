import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { createClient } from '@supabase/supabase-js';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { AuthProvider } from "react-oidc-context";

const supabase = createClient(
  "https://zjzzsrjcmcwqdjzuhqal.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqenpzcmpjbWN3cWRqenVocWFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI2NjkxNTUsImV4cCI6MjAyODI0NTE1NX0.p1hYda8iwBFHOkE-c0z9oJqXLR8RbNw_H5rAbfYCagg" 
);

const oidcConfig = {
  onSigninCallback: (user: any) => {
    window.location.href = '/home'
  },
  authority: 'http://psusso-test.psu.ac.th/application/o/psuapi-contest-nextapi',
  client_id:
    'j6eSrMS08CLwLUprhFAlg6FB8o0JUF8mtuHapoDk',
  scope: 'openid email profile offline_access',
  response_ype: 'code',
  silent_renew: true,
  use_refresh_token: true,
  redirect_uri: 'http://localhost:3000/home',
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider {...oidcConfig}>
    <SessionContextProvider supabaseClient={supabase}>
      <Component {...pageProps} />
    </SessionContextProvider>
    </AuthProvider>
  );
}
