import React from "react";
import { useAuth } from "react-oidc-context";
import PSUOauthImage from "../assets/icon/PSUOauth.svg";
import { LoginNavbar } from "@/components/Login-Navbar";

const Index = () => {
  const auth = useAuth();

  return (
    <div
      className="flex justify-center items-center h-screen bg-cover bg-gradient-to-b from-sky-300 to-indigo-300 relative overflow-hidden"
      style={{
        // backgroundImage:
        //   'url("https://lh3.googleusercontent.com/p/AF1QipOqN3E_kDF9cgadnUfOy0W5h3XRdsRclM4MR6t2=s1360-w1360-h1020")',
      }}
    >
      <div className="fixed top-0 w-full">
        <LoginNavbar />
      </div>
      <button
        className="bg-blue-900 hover:bg-blue-800 text-white font-bold p-5 rounded-md ripple-effect w-50 transform transition-transform hover:scale-110 animate-bounce w-1/2"
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
