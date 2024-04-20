"use client";
import React from "react";
import { useAuth } from "react-oidc-context";
import { Button } from "flowbite-react";
import PSUOauthImage from "../assets/icon/PSUOauth.svg";
const Index = () => {
  const auth = useAuth();
  return (
    <div
      className="flex justify-center items-center h-screen bg-cover "
      style={{
        backgroundImage:
          'url("https://lh3.googleusercontent.com/p/AF1QipOqN3E_kDF9cgadnUfOy0W5h3XRdsRclM4MR6t2=s1360-w1360-h1020")',
      }}
    >
      {/* <Button
       className="px-10"
        size={'xl'}
        gradientDuoTone="pinkToOrange"
        onClick={() => auth.signinRedirect()}
      >
        Log in
      </Button> */}
      <button
        className="  bg-blue-500 hover:bg-blue-700 text-white font-bold p-4 rounded-md ripple-effect w-1/5"
        onClick={() => auth.signinRedirect()}
      >
        <span className="flex items-center justify-center">
          <img
            className="w-full"
            src={PSUOauthImage.src}
            alt="PSU login button"
          />
        </span>
      </button>
    </div>
  );
};

export default Index;
