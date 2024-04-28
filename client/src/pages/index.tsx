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
      className="flex flex-col justify-center items-center h-screen bg-cover relative overflow-hidden "
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1435527173128-983b87201f4d?q=80&w=2067&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
      }}
    >
      <div className="fixed top-0 w-full">
        <LoginNavbar />
      </div>
      {/* <img src="https://www.computing.psu.ac.th/th/wp-content/uploads/2018/05/Logo-PSU-EH-01.png" alt="psu-songkla"  className="w-1/5"/> */}
      <button
        className="bg-blue-900 hover:bg-blue-800 text-white font-bold p-4 rounded-md ripple-effect w-50 transform transition-transform hover:scale-110 animate-bounce w-1/5"
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
