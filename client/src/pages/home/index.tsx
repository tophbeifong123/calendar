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
  const [classDate, setClassDate] = useState<any[]>([]);
  const [events, setEvents] = useState<any>({});
  const [examDate, setExamDate] = useState<any[]>([]);
  const [studentDetails, setStudentDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [startRecur, setStartRecur] = useState<any>({});
  console.log("test1", examDate);
  useEffect(() => {
    setLoading(true)
    if (auth.user?.access_token) {
      fectStudentDetail();
      fectStudentClassDate();
      fectStartRecur();
      setLoading(false)
    } else {
      console.log("No access token available");
      setLoading(false)
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
        backgroundColor: "#FF6500",
      }));
      const mergedEvents = [...newEventsFromClass, ...newEventsFromExam];
      setEvents(mergedEvents);

      console.log("MergeEvents", mergedEvents);
    }
  }, [classDate, examDate]);

  const fectStudentDetail = async () => {
    try {
      const result = await axios.get(
        `${conf.apiUrlPrefix}/api/fetch-student-detail`,
        {
          headers: {
            token: auth.user?.access_token,
          },
        }
      );
      setStudentDetails(result.data.data[0]);
      console.log("studentdetail", result.data.data[0]);
    } catch (error) {
      console.error("Error fetching student detail:", error);
    }
  };

  const fectStartRecur = async () => {
    if (auth.isAuthenticated) {
      try {
        const result = await axios.get(
          `${conf.apiUrlPrefix}/schedules?eduYear=2563&eduTerm=1`
        );
        setStartRecur(result.data);
        console.log("startRecur", result.data[0].startRecur);
      } catch (error) {
        console.error("Error fetching StartRecur:", error);
      }
    }
  };

  const fectStudentClassDate = async () => {
    try {
      const result = await axios.get(
        `${conf.apiUrlPrefix}/api/fetch-student-class-date`,
        {
          headers: {
            token: auth.user?.access_token,
          },
        }
      );
      const resultExam = await axios.get(
        `${conf.apiUrlPrefix}/api/fetch-student-exam-date`,
        {
          headers: {
            token: auth.user?.access_token,
          },
        }
      );
      setClassDate(result.data);
      setExamDate(resultExam.data);
      console.log("classDate", result.data);
      console.log("examDate1", resultExam.data);
    } catch (error) {
      console.error("Error fetching student detail:", error);
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
