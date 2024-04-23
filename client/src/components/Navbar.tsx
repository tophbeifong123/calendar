"use client";
import { useAuth } from "react-oidc-context";
import axios from "axios";
import { Avatar, Dropdown, Navbar, Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import PsuLogo from '../assets/icon/psuLogo1.png'
import {
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip,
  Accordion,
  AccordionHeader,
  AccordionBody,
  Alert,
  Input,
  Drawer,
  Card,
} from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";

export function CustomNavbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  interface profileImg {
    studentId: string;
    pictureBase64: string;
  }
  const auth = useAuth();
  const [profileImg, setprofileImg] = useState<profileImg | null>(null);
  useEffect(() => {
    fectStudentDetail();
  }, [auth]);
  const fectStudentDetail = async () => {
    if (!auth.user?.access_token) {
      console.error("Access token is not available");
      return;
    }
    try {
      const result = await axios.get(
        `https://api-gateway.psu.ac.th/Test/regist/level2/StudentImage/token`,
        {
          headers: {
            credential: "api_key=JwnMeh+gj2rjD4PmSRhgbz13m9mKx2EF",
            token: auth.user.access_token,
          },
        }
      );
      setprofileImg(result.data.data[0]);
    } catch (error) {
      console.error("Error fetching student detail:", error);
    }
  };

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);


  return (
    <>
    <Navbar fluid rounded className="bg-[#222831]">
      <Navbar.Brand>
        <IconButton
          variant="text"
          size="medium"
          onClick={openDrawer}
          className="mr-2"
          style={{ color: '#EEEEEE' }} 
        >
          {isDrawerOpen ? (
            <XMarkIcon className="h-8 w-full stroke-2" />
          ) : (
            <Bars3Icon className="h-8 w-full stroke-2" />
          )}
        </IconButton>
        {/* <img
          className="h-8 mr-3"
          src={PsuLogo.src}
          alt="logo psu"/> */}
        <span className="self-center whitespace-nowrap text-xl font-semibold ml-1 flex flex-row">
        PSU Calendar
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar
              alt="User settings"
              img={`data:image/png;base64,${profileImg?.pictureBase64}`}
              rounded
            />
          }
        >
          <Dropdown.Header>
            <span className="block text-sm">{profileImg?.studentId}</span>
          </Dropdown.Header>
          <Dropdown.Divider />
          <Link href="/">
            <Dropdown.Item onClick={() => auth.signoutRedirect()}>
              Sign out
            </Dropdown.Item>
          </Link>
        </Dropdown>
        <Navbar.Toggle />
      </div>
    </Navbar>
    <Drawer open={isDrawerOpen} onClose={closeDrawer}>
    <div className="p-4">
  <div className="flex items-center mb-4">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 mr-2"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
      />
    </svg>
    <Typography className="text-lg font-semibold ">Calefdfndar</Typography>
  </div>

  <div className="flex items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 mr-2"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
      />
    </svg>
    <Typography className="text-lg font-semibold ">Gfdfoogle</Typography>
  </div>
</div>

  
   
</Drawer>

    </>
  );
}
