import { useState, useEffect } from "react";
import axios from "axios";
import { CustomNavbar } from "@/components/Navbar";
import Calendar from "@/components/Calendar";
import { useAuth } from "react-oidc-context";
import SlideBar from "@/components/SlideBar";

function Home() {

  const [classDate, setClassDate] = useState<any>([]);
  const auth = useAuth();
  // console.log("token",auth.user?.access_token)

  useEffect(() => {
    fectStudentDetail();
  }, [auth]); 

  const events = [
    {
      title: "กินข้าวกับครอบครัว",
      start: new Date().setHours(18, 30),
      end: new Date().setHours(20, 30),
      allDay: false,
    },
    {
      title: "ออกกำลังกาย",
      start: new Date("2024-04-20"),
      end: new Date("2024-04-20"),
      allDay: true,
    },
  ];
  const fectStudentDetail = async () => {
    if (!auth.user?.access_token) {
      console.error("Access token is not available");
      return;
    }
    try {
      const result = await axios.get(
        `https://api-gateway.psu.ac.th/Test/regist/level2/RegistData/token?eduTerm=1&eduYear=2564`,
        {
          headers: {
            credential: "api_key=JwnMeh+gj2rjD4PmSRhgbz13m9mKx2EF",
            token: auth.user.access_token,
          },
        }
      );
      
      console.log(result.data);
    } catch (error) {
      console.error("Error fetching student detail:", error);
    }
  };
  const fectStudentClassDate = async () => {
    if (!auth.user?.access_token) {
      console.error("Access token is not available");
      return;
    }
    try {
      const result = await axios.get(
        `https://api-gateway.psu.ac.th/Test/regist/level2/StudentClassDate/token?eduTerm=1&eduYear=2563`,
        {
          headers: {
            credential: "api_key=JwnMeh+gj2rjD4PmSRhgbz13m9mKx2EF",
            token: auth.user.access_token,
          },
        }
      );
      setClassDate(result.data);
      
      console.log("classdate",result.data);
    } catch (error) {
      console.error("Error fetching student detail:", error);
    }
  };

  return (
    <>
      <CustomNavbar />
      <div className="flex justify-center items-center h-screen bg-gray-100">
      <SlideBar/>
        <Calendar events={events} />
      </div>
    </>
  );
}

export default Home;
