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
      className="hero min-h-screen"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1588453251771-cd919b362ed4?q=80&w=2128&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
      }}
    >
      {/* <div className="fixed top-0 w-full">
        <LoginNavbar />
      </div> */}
      {/* <img src="https://www.computing.psu.ac.th/th/wp-content/uploads/2018/05/Logo-PSU-EH-01.png" alt="psu-songkla"  className="w-1/5"/> */}

      <div className="hero-overlay bg-opacity-50"></div>
      <div className="hero-content text-center text-neutral-content">
        <div className="max-w-md">
          <h1 className="mb-5 text-5xl font-bold">PSU Calendar</h1>
          <p className="mb-5">
          สามารถแสดงปฏิทินการเรียนของตนเองได้อย่างสะดวกสบาย โดยเว็บแอปพลิเคชันนี้จะแสดงข้อมูลต่าง ๆ เช่น ตารางเรียน วันสอบ และวันหยุดต่างๆ ที่เกี่ยวข้องกับการศึกษาของนักศึกษา ได้อย่างง่ายดาย
          </p>

          <button
            className="bg-blue-900 hover:bg-blue-800 text-white font-bold p-4 rounded-2xl ripple-effect w-50 transform transition-transform hover:scale-110 animate-bounce w-4/6  mt-5"
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
      </div>
    </div>
  );
};

export default Index;
