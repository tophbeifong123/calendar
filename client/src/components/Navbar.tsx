"use client";
import { useAuth } from "react-oidc-context";
import axios from "axios";
import { Avatar, Dropdown, Navbar, Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import PsuLogo from "../assets/icon/psuLogo1.png";
import {
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Drawer,
  Card,
} from "@material-tailwind/react";
import {
  Bars3Icon,
  CalendarDaysIcon,
  LinkIcon,
  PowerIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

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
            style={{ color: "#EEEEEE" }}
          >
            {isDrawerOpen ? (
              <XMarkIcon className="h-8 w-full stroke-2" />
            ) : (
              <Bars3Icon className="h-8 w-full stroke-2" />
            )}
          </IconButton>
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
        <Card className="h-[calc(100vh-2rem)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5">
          <div className="mb-2 p-4 flex items-center">
            <img className="h-8 mr-3" src={PsuLogo.src} alt="logo psu" />
            <Typography variant="h5" color="blue-gray">
              Calendar
            </Typography>
          </div>
          <List>
            <Link href="/home">
              <ListItem>
                <ListItemPrefix>
                  <CalendarDaysIcon className="h-5 w-5" />
                </ListItemPrefix>
                Calendar
              </ListItem>
            </Link>
            <Link href="/Google">
              <ListItem>
                <ListItemPrefix>
                  <LinkIcon className="h-5 w-5" />
                </ListItemPrefix>
                Google
              </ListItem>
            </Link>
            <Link href="/">
              <ListItem>
                <ListItemPrefix>
                  <PowerIcon className="h-5 w-5" />
                </ListItemPrefix>
                <a onClick={() => auth.signoutRedirect()}>Sign Out</a>
              </ListItem>
            </Link>
          </List>
        </Card>
      </Drawer>
    </>
  );
}
