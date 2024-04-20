"use client";

import { Sidebar } from "flowbite-react";
import { FaCalendar } from "react-icons/fa";
import { BiLogoGooglePlusCircle } from "react-icons/bi";
import { FaGoogle } from "react-icons/fa6";
import { AiFillCarryOut } from "react-icons/ai";
export default function SlideBar() {
  return (
    <Sidebar aria-label="Default sidebar example">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item href="/home" icon={FaCalendar} >
              Calendar
          </Sidebar.Item>
          <Sidebar.Item
            href="/Google"
            icon={AiFillCarryOut}
            label="Pro"
            labelColor="dark"
          >
            Google
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
