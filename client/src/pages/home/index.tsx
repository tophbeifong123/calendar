import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { CustomNavbar } from "@/components/Navbar";
import { useAuth } from "react-oidc-context";
import SlideBar from "@/components/SlideBar";
import CustomCalendar from "@/components/Calendar";
import DateTimePicker from "react-datetime-picker";
import conf from "@/conf/main";

function Home() {
  const auth = useAuth();
  const [classDate, setClassDate] = useState<any>([]);
  const [events, setEvents] = useState<any>({});
  const [examDate, setExamDate] = useState<any>({});
  const [studentDetails, setStudentDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [startRecur, setStartRecur] = useState<any>({});
  console.log("test1", examDate);
  useEffect(() => {
    if (auth.user?.access_token) {
      fectStudentDetail();
      fectStudentClassDate();
      fectStartRecur();
      // test();
    } else {
      console.log("No access token available");
    }
  }, [auth]);

  useEffect(() => {
    if (classDate.length > 0 && examDate.length > 0 && startRecur) {
      const newEventsFromClass = classDate.map((item: any) => ({
        title: `${item.subjectCode} ${item.subjectNameThai} (${item.subjectNameEng}) `,
        description: ` ${item.roomId || item.roomName || "ไม่ระบุห้องเรียน"}`,
        daysOfWeek: [item.classDate],
        startTime: `${item.startTime.substring(
          0,
          2
        )}:${item.startTime.substring(2, 4)}`,
        endTime: `${item.stopTime.substring(0, 2)}:${item.stopTime.substring(
          2,
          4
        )}`,
        lecturer: `${item.lecturerNameThai}`,
        startRecur: `${startRecur[0].startRecur}`,
        endRecur: `${examDate[0].examDate.substring(0, 10)}T00:00:00`,
        section: `${item.section || "ไม่ระบุกลุ่ม"}`,
      }));

      const newEventsFromExam = examDate.map((item: any) => ({
        title: `${item.subjectCode} ${item.subjectNameThai} (${item.subjectNameEng}) `,
        description: ` ${item.roomId || item.roomName || "ไม่ระบุห้องเรียน"}`,
        examTypeDesc: `${item.examTypeDesc}`,
        examdateTypeDesc: `${item.examdateTypeDesc}`,
        start: `${item.examDate.substring(
          0,
          10
        )}T${item.examStartTime.substring(0, 2)}:${item.examStartTime.substring(
          2,
          4
        )}`,
        end: `${item.examDate.substring(
          0,
          10
        )}T${item.examStopTime.substring(0, 2)}:${item.examStopTime.substring(
          2,
          4
        )}`,
        section: `${item.section || "ไม่ระบุกลุ่ม"}`,
        backgroundColor: "#00ADB5",
      }));
      const mergedEvents = [...newEventsFromClass, ...newEventsFromExam];
      setEvents(mergedEvents);

      console.log("MergeEvents", mergedEvents);
    }
  }, [classDate, examDate]);

  const fectStudentDetail = async () => {
    setLoading(true);
    if (!auth.user?.access_token) {
      console.error("Access token is not available");
      return;
    }
    try {
      const result = await axios.get(
        `https://api-gateway.psu.ac.th/Test/regist/level2/StudentDetail/token
          `,
        {
          headers: {
            credential: "api_key=JwnMeh+gj2rjD4PmSRhgbz13m9mKx2EF",
            token: auth.user.access_token,
          },
        }
      );
      setStudentDetails(result.data.data[0]);
      console.log("studentdetail", result.data.data[0]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching student detail:", error);
      setLoading(false);
    }
  };

  const fectStartRecur = async () => {
    setLoading(true);
    if (auth.isAuthenticated) {
      try {
        const result = await axios.get(
          `${conf.apiUrlPrefix}/schedules?eduYear=2563&eduTerm=1`
        );
        setStartRecur(result.data);
        console.log("startRecur", result.data[0].startRecur);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching student detail:", error);
        setLoading(false);
      }
    }
  };

  const fectStudentClassDate = async () => {
    setLoading(true);
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
      const resultExam = await axios.get(
        `https://api-gateway.psu.ac.th/Test/regist/level2/StudentExamdate/token?eduTerm=1&eduYear=2563&offset=0&limit=20`,
        {
          headers: {
            credential: "api_key=JwnMeh+gj2rjD4PmSRhgbz13m9mKx2EF",
            token: auth.user.access_token,
          },
        }
      );
      setExamDate(resultExam.data.data);
      setClassDate(result.data.data);
      setLoading(false);
      console.log("classDate", result.data.data);
      console.log("examDate", resultExam.data.data);
    } catch (error) {
      console.error("Error fetching student detail:", error);
      setLoading(false);
    }
  };

  return (
    <>
      <CustomNavbar />
      {loading ? (
        <div className="flex justify-center items-center h-screen bg-gray-100">
          loading....
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen bg-[#EEEEEE]">
          <CustomCalendar details={studentDetails} events={events} />
        </div>
      )}
    </>
  );
}

export default Home;
