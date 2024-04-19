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
          'url("https://img.freepik.com/free-vector/blue-pink-halftone-background_53876-99004.jpg?size=626&ext=jpg&ga=GA1.1.34264412.1713398400&semt=ais")',
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
      >
        <span className="flex items-center justify-center">
          <img
            className="w-full"
            src={PSUOauthImage.src}
            alt="PSU login button"
            onClick={() => auth.signinRedirect()}
          />
        </span>
      </button>
    </div>
  );
};

export default Index;
