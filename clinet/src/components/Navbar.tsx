"use client";
import { useAuth } from "react-oidc-context";
import axios from "axios";
import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { useEffect, useState } from "react";
export function CustomNavbar() {
    interface profileImg {
        studentId: string;
        pictureBase64: string;
      }
    const auth = useAuth();
    const [profileImg, setprofileImg] = useState<profileImg|null>(null);
    useEffect(() => {
        fectStudentDetail();
    }, []);
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
                            img={`data:image/png;base64,${profileImg?.pictureBase64}`}
                            rounded
                        />
                    }
                >
                    <Dropdown.Header>
                        <span className="block text-sm">{profileImg?.studentId}</span>
                    </Dropdown.Header>
                    <Dropdown.Divider />
                    <Dropdown.Item>Sign out</Dropdown.Item>
                </Dropdown>
                <Navbar.Toggle />
            </div>
        </Navbar>
    );
}
