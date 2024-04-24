import React, { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import PSUOauthImage from "../assets/icon/PSUOauth.svg";
import { LoginNavbar } from "@/components/Login-Navbar";
import { useRouter } from "next/router";

const Index = () => {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth.isAuthenticated) {
      router.push("/home");
    }
  }, [auth.isAuthenticated, router]);

  return (
    <div
      className="flex flex-col justify-center items-center h-screen bg-cover relative overflow-hidden bg-gradient-to-r from-cyan-200 to-blue-200"
      // style={{
      //   // backgroundImage:
      //   //   'url("https://lh3.googleusercontent.com/p/AF1QipOqN3E_kDF9cgadnUfOy0W5h3XRdsRclM4MR6t2=s1360-w1360-h1020")',
      // }}
    >
      <div className="fixed top-0 w-full">
        <LoginNavbar />
      </div>
      <img src="https://www.computing.psu.ac.th/th/wp-content/uploads/2018/05/Logo-PSU-EH-01.png" alt="psu-songkla"  className="w-1/4"/>
      <button
        className="bg-blue-900 hover:bg-blue-800 text-white font-bold p-4 rounded-md ripple-effect w-50 transform transition-transform hover:scale-110 animate-bounce w-1/4"
        onClick={() => auth.signinRedirect()}
      >
        <span className="flex items-center justify-center">
          <img className="w-full" src={PSUOauthImage.src} alt="PSU login button" />
        </span>
      </button>
    </div>
  );
};

export default Index;
