"use client";
import React from "react";
import { useAuth } from "react-oidc-context";
import { Button } from "flowbite-react";
const Index = () => {
  const auth = useAuth();
  return (
    <div
      className="flex justify-center items-center h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          'url("https://lh3.googleusercontent.com/p/AF1QipOqN3E_kDF9cgadnUfOy0W5h3XRdsRclM4MR6t2=s1360-w1360-h1020")',
      }}
    >
      <Button
       className="px-10"
        size={'xl'}
        gradientDuoTone="pinkToOrange"
        onClick={() => auth.signinRedirect()}
      >
        Log in
      </Button>
    </div>
  );
};

export default Index;
