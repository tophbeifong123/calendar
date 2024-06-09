"use client";
import { Avatar, Dropdown, Navbar } from "flowbite-react";
import PSUImage from "../assets/icon/logo-psupassport.png";

export function LoginNavbar() {
  return (
    <Navbar fluid rounded className="bg-[#DBE2EF]">
      <Navbar.Brand href="/">
        <span className="self-center whitespace-nowrap text-xl font-semibold ">
          <img className="w-1/6" src={PSUImage.src} alt="logo psu" />
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar
              alt="User settings"
              img={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyvm4l6do2AnYA6hAOAMbHrxogaf6cZOeaAgEJEvqiLQ&s`}
              rounded
            />
          }
        ></Dropdown>
        <Navbar.Toggle />
      </div>
    </Navbar>
  );
}
