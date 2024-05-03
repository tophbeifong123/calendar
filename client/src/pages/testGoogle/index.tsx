import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { CustomNavbar } from "@/components/Navbar";
import { useAuth } from "react-oidc-context";
import SlideBar from "@/components/SlideBar";
import CustomCalendar from "@/components/Calendar";
import DateTimePicker from "react-datetime-picker";
import conf from "@/conf/main";
import { useRouter } from "next/router";
import { FooterComponent } from "@/components/Footer";
import { Spinner } from "flowbite-react";
import { AccordionSetting } from "@/components/AccordionSetting";
import { ProfileAuthContext } from "@/contexts/Auth.context";

function Home() {
    const auth = useAuth();
    const [events, setEvents] = useState<any>({});
    const [classDate, setClassDate] = useState<any[]>([]);
    const [examDate, setExamDate] = useState<any[]>([]);
    const [holidayDate, setHolidayDate] = useState<any[]>([]);
    const [studentDetails, setStudentDetails] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const startRecur = new Date();
    const [holidayDateFormat, setHolidayDateFormat] = useState<any>([]);
    const app = useRouter();
    const value = useContext(ProfileAuthContext);
    // console.log("test1", examDate);
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
                    dateTime: `${item.classDate}T${item.startTime.substring(
                        0,
                        2
                    )}:${item.startTime.substring(2, 4)}:00`,
                    timeZone: "Asia/Bangkok", 
                },
                end: {
                    dateTime: `${item.classDate}T${item.stopTime.substring(
                        0,
                        2
                    )}:${item.stopTime.substring(2, 4)}:00`,
                    timeZone: "Asia/Bangkok", 
                },
                description: `Lecturer: ${item.lecturerNameThai}\nSection: ${
                    item.section || "ไม่ระบุกลุ่ม"
                }`,
                recurrence: [
                    `RRULE:FREQ=WEEKLY;UNTIL=${maxExamDate.examDate.substring(
                        0,
                        10
                    )}T00:00:00;BYDAY=${getDayOfWeek(item.classDate)}`,
                ],
            }));

            const newEventsFromExam = examDate.map((item) => ({
                summary: `${item.subjectCode} ${item.subjectNameThai} (${item.subjectNameEng})`,
                description: `${item.roomId || item.roomName || "ประเภทการสอบ"}\nExam Type: ${item.examTypeDesc || "ไม่ระบุชื่อตึกสอบ"}\nExam Date Type: ${item.examdateTypeDesc || "ไม่ระบุประเภทวันสอบ"}\nBuilding Name: ${item.buildingName || "ไม่ระบุชื่อตึกสอบ"}\nNo. of Examinee: ${item.noExaminee || "จำนวนผู้เข้าสอบ"}`,
                start: {
                    dateTime: `${item.examDate.substring(0, 10)}T${item.examStartTime.substring(0, 2)}:${item.examStartTime.substring(2, 4)}:00`,
                    timeZone: 'Asia/Bangkok' 
                },
                end: {
                    dateTime: `${item.examDate.substring(0, 10)}T${item.examStopTime.substring(0, 2)}:${item.examStopTime.substring(2, 4)}:00`,
                    timeZone: 'Asia/Bangkok' 
                },
                recurrence: [],
                colorId: '6' // Sets the background color, you can choose any color from Google Calendar's predefined colors
            }));
            
            

            
            const mergedEvents = [...newEventsFromClass, ...newEventsFromExam];
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
            const resultHoliday = await axios.get(
                `${conf.apiUrlPrefix}/api/fetch-holiday-google`
            );

            setClassDate(result.data);
            setExamDate(resultExam.data);
            setHolidayDate(resultHoliday.data.items);

            console.log("classDate", result.data);
            console.log("examDate", resultExam.data);
            console.log("holidayData", resultHoliday.data.items.slice(0, 100));
        } catch (error) {
            console.error("Error fetching student detail:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <CustomNavbar />
            {loading ? (
                <>
                    <div className="flex justify-center items-center h-screen bg-[#faf7f8]">
                        <progress className="progress w-56"></progress>
                    </div>
                    <FooterComponent />
                </>
            ) : (
                <>
                    <div className="flex flex-col justify-center items-center h-screen bg-[#faf7f8]">
                        hello google
                        <button className="bg-blue-gray-600">hit me up</button>
                    </div>
                    <FooterComponent />
                </>
            )}
        </>
    );
}

export default Home;
