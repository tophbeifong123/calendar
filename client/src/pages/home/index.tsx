import React, { useState, useEffect } from "react";
import axios from "axios";
import { CustomNavbar } from "@/components/Navbar";
import { useAuth } from "react-oidc-context";
import CustomCalendar from "@/components/Calendar";
import conf from "@/conf/main";
import { FooterComponent } from "@/components/Footer";

function Home() {
  const auth = useAuth();
  const [events, setEvents] = useState<any>({});
  const [classDate, setClassDate] = useState<any[]>([]);
  const [examDate, setExamDate] = useState<any[]>([]);
  const [holidayDate, setHolidayDate] = useState<any[]>([]);
  const [postDate, setPostDate] = useState<any[]>([]);
  const [postDateFormat, setPostDateFormat] = useState<any[]>([]);
  const [studentDetails, setStudentDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchPost, setFetchPost] = useState<boolean>(false);
  const [startRecur, setStartRecur] = useState<any>({});
  const [holidayDateFormat, setHolidayDateFormat] = useState<any>([]);

  useEffect(() => {
    if (auth.isAuthenticated) {
      setLoading(true);
      fectStudentDetail();
      fectStudentClassDate();
      fectStartRecur();
    } else {
      console.log("No access token available");
    }
  }, [auth]);

  useEffect(() => {
    if (auth.isAuthenticated) {
      fetchPostDate();
    }
  }, [auth, fetchPost]);

  const triggerFetchPost = () => {
    setFetchPost((fetchPost) => !fetchPost);
  };

  useEffect(() => {
    if (
      (classDate.length > 0 && examDate.length > 0 && startRecur) ||
      postDate.length > 0
    ) {
      const maxExamDate = examDate.reduce((maxDate, currentDate) => {
        const currentExamDate = new Date(currentDate.examDate);
        const maxExamDate = new Date(maxDate.examDate);
        return currentExamDate > maxExamDate ? currentDate : maxDate;
      }, examDate[0]);
      console.log("MaxStopRecur", maxExamDate);
      const newEventsFromClass = classDate.map((item: any) => ({
        title: `${item.subjectCode} ${item.subjectNameThai} (${item.subjectNameEng}) `,
        subjectCode: `${item.subjectCode}`,
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
        startRecur: `${startRecur}`,
        endRecur: `${maxExamDate.examDate.substring(0, 10)}T00:00:00`,
        section: `${item.section || "ไม่ระบุกลุ่ม"}`,
      }));

      const newEventsFromExam = examDate.map((item: any) => ({
        title: `${item.subjectCode} ${item.subjectNameThai} (${item.subjectNameEng}) `,
        subjectCode: `${item.subjectCode}`,
        description: ` ${item.roomId || item.roomName || "ประเภทการสอบ"}`,
        examTypeDesc: `${item.examTypeDesc || "ไม่ระบุชิ่อตึกสอบ"}`,
        examdateTypeDesc: `${item.examdateTypeDesc || "ไม่ระบุประเภทวันสอบ"}`,
        buildingName: `${item.buildingName || "ไม่ระบุชิ่อตึกสอบ"}`,
        noExaminee: `${item.noExaminee || "จำนวนผู้เข้าสอบ"}`,
        start: `${item.examDate.substring(
          0,
          10
        )}T${item.examStartTime.substring(0, 2)}:${item.examStartTime.substring(
          2,
          4
        )}`,
        end: `${item.examDate.substring(0, 10)}T${item.examStopTime.substring(
          0,
          2
        )}:${item.examStopTime.substring(2, 4)}`,
        section: `${item.section || "ไม่ระบุกลุ่ม"}`,
        backgroundColor: "#FF6500",
      }));

      const newEventsFromHoliday = holidayDate.map((item: any) => ({
        title: `${item.summary} `,
        subjectCode: `holidayDate`,
        description: ` ${item.description}`,
        start: `${item.start.date}`,
        end: `${item.end.date}`,
        backgroundColor: "#FFC7C7",
        allday: true,
      }));

      const newEventsFromPost = postDate.map((item: any) => ({
        id: `${item.id} `,
        title: `${item.subjectCode} ${item.title} `,
        subjectCode: `${item.subjectCode}`,
        description: ` ${item.description}`,
        start: `${item.startTime.substring(0, 19)}`,
        end: `${item.stopTime.substring(0, 19)}`,
        image: `${item.image}`,
        createdDate: `${item.createdDate}`,
        status: `${item.status}`,
        backgroundColor: item.vote >= 5 ? "#C3FF93" : "#EEEEEE",
        allday: true,
        createBy: `${item.createBy.studentId}`,
        vote: `${item.vote}`,
        votedBy: `${item.votedBy}`,
      }));
      const mergedEvents = [...newEventsFromClass, ...newEventsFromExam];
      setEvents(mergedEvents);
      setPostDateFormat(newEventsFromPost);
      setHolidayDateFormat(newEventsFromHoliday);

      console.log("MergeEvents", mergedEvents);
    }
  }, [classDate, examDate, postDate]);

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
    try {
      const result = await axios.get(
        `${conf.apiUrlPrefix}/termdates?eduYear=2563&eduTerm=1`
      );
      setStartRecur(result.data[0].startRecur);
      console.log("startRecur", result.data[0].startRecur);
    } catch (error) {
      console.error("Error fetching StartRecur:", error);
    }
  };

  const fectStudentClassDate = async () => {
    setLoading(true);
    try {
      const result = await axios.get(
        `${conf.apiUrlPrefix}/api/fetch-student-class-date?eduYear=2563&eduTerm=1`,
        {
          headers: {
            token: auth.user?.access_token,
          },
        }
      );
      const resultExam = await axios.get(
        `${conf.apiUrlPrefix}/api/fetch-student-exam-date?eduYear=2563&eduTerm=1`,
        {
          headers: {
            token: auth.user?.access_token,
          },
        }
      );
      const resultHoliday = await axios.get(
        `${conf.apiUrlPrefix}/api/fetch-holiday-google`
      );

      setClassDate(result.data);
      setExamDate(resultExam.data);
      setHolidayDate(resultHoliday.data.items);

    } catch (error) {
      console.error("Error fetching student detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPostDate = async () => {
    try {
      const resultPost = await axios.get(`${conf.apiUrlPrefix}/schedules`);
      setPostDate(resultPost.data);
    } catch (error) {
      console.error("Error fetching post date:", error);
    }
  };

  return (
    <>
      <CustomNavbar />
      {loading ? (
        <>
          <div className="flex justify-center items-center h-screen bg-base-200">
            <progress className="progress w-56"></progress>
          </div>
          <FooterComponent />
        </>
      ) : (
        <>
          <div className="flex justify-center items-center h-screen bg-base-200">
            <CustomCalendar
              fetch={triggerFetchPost}
              details={studentDetails}
              filterClass={classDate}
              filterExam={examDate}
              postDateFormat={postDateFormat}
              holidayDateFormat={holidayDateFormat}
              events={events}
            />
          </div>
          <FooterComponent />
        </>
      )}
    </>
  );
}

export default Home;
