import React, { useState, useEffect } from "react";
import axios from "axios";
import { CustomNavbar } from "@/components/Navbar";
import { useAuth } from "react-oidc-context";
import SlideBar from "@/components/SlideBar";
import CustomCalendar from "@/components/Calendar";

function Home() {

  const [classDate, setClassDate] = useState<any>([]);
  const auth = useAuth();
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    fectStudentDetail();
    fectStudentClassDate();
  }, [auth]); 

  useEffect(() => {
    if (classDate.length > 0) {
      const newEvents = classDate.map((item: any) => ({
        title: `${item.subjectNameEng} (${item.subjectCode})`,
        description: `เรียนที่: ${item.roomId || item.roomName || 'ไม่ระบุห้องเรียน'}`,
        daysOfWeek: [item.classDate],
        startTime: `${item.startTime.substring(0, 2)}:${item.startTime.substring(2, 4)}`,
        endTime: `${item.stopTime.substring(0, 2)}:${item.stopTime.substring(2, 4)}`, 
      }));
      console.log("Events:", newEvents);
      setEvents(newEvents);
    }
  }, [classDate]);

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
      setClassDate(result.data.data);
      
      console.log("classdate",result.data);
    } catch (error) {
      console.error("Error fetching student detail:", error);
    }
  };

  return (
    <>
      <CustomNavbar />
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <SlideBar />
        <CustomCalendar events={events} />
      </div>
    </>
  );
}

export default Home;
