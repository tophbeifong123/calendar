import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { CustomNavbar } from "@/components/Navbar";
import { useAuth } from "react-oidc-context";
import conf from "@/conf/main";
import { FooterComponent } from "@/components/Footer";
import { useSession } from "@supabase/auth-helpers-react";
import { ProfileAuthContext } from "@/contexts/Auth.context";

function ImportToGoogle() {
  const auth = useAuth();
  const [events, setEvents] = useState<any>({});
  const [classDate, setClassDate] = useState<any[]>([]);
  const [examDate, setExamDate] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const startRecur = "2020-07-13T00:00:00";
  const session = useSession();
  const value = useContext(ProfileAuthContext);

  useEffect(() => {
    if (auth.isAuthenticated) {
      setLoading(true);
      fectStudentClassDate();
    } else {
      // app.push("/")
      console.log("No access token available");
    }
  }, [auth]);

  useEffect(() => {
    if (classDate.length > 0 && examDate.length > 0 && startRecur) {
      const maxExamDate = examDate.reduce((maxDate, currentDate) => {
        const currentExamDate = new Date(currentDate.examDate);
        const maxExamDate = new Date(maxDate.examDate);
        return currentExamDate > maxExamDate ? currentDate : maxDate;
      }, examDate[0]);
      console.log("MaxStopRecur", maxExamDate);
      const getDayOfWeek = (dateString: string) => {
        const date = +dateString;
        const days = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
        return days[date];
      };
      const newEventsFromClass = classDate.map((item) => ({
        summary: `${item.subjectCode} ${item.subjectNameThai} (${item.subjectNameEng})`,
        location: item.roomId || item.roomName || "ไม่ระบุห้องเรียน",
        start: {
          dateTime: `${startRecur.substring(0, 10)}T${item.startTime.substring(
            0,
            2
          )}:${item.startTime.substring(2, 4)}:00`,
          timeZone: "Asia/Bangkok",
        },
        end: {
          dateTime: `${startRecur.split("T")[0]}T${item.stopTime.substring(
            0,
            2
          )}:${item.stopTime.substring(2, 4)}:00`,
          timeZone: "Asia/Bangkok",
        },
        // start: {
        //     dateTime: "2024-05-01T13:00:00",
        //    timeZone: "Asia/Bangkok",
        // },
        // end:  {
        //     dateTime: "2024-05-01T16:00:00",
        //     timeZone: "Asia/Bangkok",
        // },
        description: `Lecturer: ${item.lecturerNameThai}\nSection: ${
          item.section || "ไม่ระบุกลุ่ม"
        }`,
        recurrence: [
          `RRULE:FREQ=WEEKLY;UNTIL=${maxExamDate.examDate
            .substring(0, 10)
            .replace(/-/g, "")}T000000Z;BYDAY=${getDayOfWeek(item.classDate)}`,
        ],
      }));

      const newEventsFromExam = examDate.map((item) => ({
        summary: `${item.subjectCode} ${item.subjectNameThai} (${item.subjectNameEng})`,
        description: `${
          item.roomId || item.roomName || "ประเภทการสอบ"
        }\nExam Type: ${
          item.examTypeDesc || "ไม่ระบุชื่อตึกสอบ"
        }\nExam Date Type: ${
          item.examdateTypeDesc || "ไม่ระบุประเภทวันสอบ"
        }\nBuilding Name: ${
          item.buildingName || "ไม่ระบุชื่อตึกสอบ"
        }\nNo. of Examinee: ${item.noExaminee || "จำนวนผู้เข้าสอบ"}`,
        start: {
          dateTime: `${item.examDate.substring(
            0,
            10
          )}T${item.examStartTime.substring(
            0,
            2
          )}:${item.examStartTime.substring(2, 4)}:00`,
          timeZone: "Asia/Bangkok",
        },
        end: {
          dateTime: `${item.examDate.substring(
            0,
            10
          )}T${item.examStopTime.substring(0, 2)}:${item.examStopTime.substring(
            2,
            4
          )}:00`,
          timeZone: "Asia/Bangkok",
        },
        recurrence: [],
        colorId: "6", // Sets the background color, you can choose any color from Google Calendar's predefined colors
      }));

      const newEventsFromUser =
        value.user?.events?.map((item) => ({
          summary: `${item.title}`,
          description: `${item.description}`,
          start: {
            dateTime: `${item.start.substring(
              0,
              19
            )}`,
            timeZone: "Asia/Bangkok",
          },
          end: {
            dateTime: `${item.end.substring(
              0,
              19
            )}`,
            timeZone: "Asia/Bangkok",
          },
          recurrence: [],
          colorId: "9",
        })) || [];

      // const mergedEvents = [...newEventsFromClass, ...newEventsFromExam];
      const mergedEvents = [
        ...newEventsFromClass,
        ...newEventsFromExam,
        ...newEventsFromUser,
      ];
      setEvents(mergedEvents);

      console.log("MergeEvents", mergedEvents);
    }
  }, [classDate, examDate]);

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

      setClassDate(result.data);
      setExamDate(resultExam.data);
      console.log("classDate", result.data);
      console.log("examDate", resultExam.data);
    } catch (error) {
      console.error("Error fetching student detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const importEvent = async () => {
    if (!session || !session.provider_token) {
      alert("โปรดเข้าสู่ระบบก่อนเพื่อสร้างกิจกรรม");
      return;
    }

    try {
      const updateGoogleStatus = await axios.put(
        `${conf.apiUrlPrefix}/user/${value.user?.id}`,
        {
          google: true,
        }
      );

      console.log("updateGoogleStatus", updateGoogleStatus);

      const requests = events.map(async (event: any) => {
        const response = await fetch(
          "https://www.googleapis.com/calendar/v3/calendars/primary/events",
          {
            method: "POST",
            headers: {
              Authorization: "Bearer " + session.provider_token,
              "Content-Type": "application/json", // ระบุชนิดของเนื้อหา
            },
            body: JSON.stringify(event), // ส่งแต่ละกิจกรรมแยกกัน
          }
        );

        if (!response.ok) {
          // จัดการข้อผิดพลาด
          const errorData = await response.json();
          console.error(
            "เกิดข้อผิดพลาดในการสร้างกิจกรรม:",
            errorData.error.message
          );
          throw new Error("เกิดข้อผิดพลาดขณะสร้างกิจกรรม");
        }
      });

      await Promise.all(requests);

      if (value.triggerFetch) {
        value.triggerFetch();
      }

      // แจ้งเตือนหลังจากทำงานเสร็จสมบูรณ์ทั้งหมด
      alert("สร้างกิจกรรมเสร็จสมบูรณ์ โปรดตรวจสอบที่ปฏิทิน Google ของคุณ!");
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการสร้างกิจกรรม:", error);
      alert("เกิดข้อผิดพลาดขณะสร้างกิจกรรม โปรดลองอีกครั้งในภายหลัง");
    }
  };

  return (
    <div
      onClick={() => {
        console.log("hited"), importEvent();
      }}
      className="flex items-center justify-center  dark:bg-gray-800"
    >
      <button
        className="px-4 py-2 border flex gap-2 border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150"
        disabled={value.user?.google}
      >
        <img
          className="w-6 h-6"
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          loading="lazy"
          alt="google logo"
        />
        <span>Import your events to Google Calendar</span>
      </button>
    </div>
  );
}

export default ImportToGoogle;
