"use client";
import { useAuth } from "react-oidc-context";
import axios from "axios";
import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { useEffect, useState } from "react";
import Link from "next/link";
interface profileImg {
  // กำหนดชนิดข้อมูลของ studentId
  studentId: string;
  pictureBase64: string;
}
export function CustomNavbar() {
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
      setprofileImg(result.data?.data[0]);
      console.log(result.data?.data[0]);
    } catch (error) {
      console.error("Error fetching student detail:", error);
    }
  };
  const handleSignOut = async () => {
    await auth.signoutSilent();
  };
  return (
    <Navbar fluid rounded>
      <Navbar.Brand href="/home">
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
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
              img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
              rounded
            />
          }
        >
          <Dropdown.Header>
            <span className="block text-sm">{profileImg?.studentId}</span>
          </Dropdown.Header>

          <Dropdown.Divider />
          <Link href='/'>
          <Dropdown.Item onClick={handleSignOut}>Sign out</Dropdown.Item>
          </Link>
        </Dropdown>
        <Navbar.Toggle />
      </div>
    </Navbar>
  );
}
