import React, { ChangeEvent, useEffect, useState } from "react";
import { CustomNavbar } from "@/components/Navbar";
import SlideBar from "@/components/SlideBar";
import toast, { Toaster } from "react-hot-toast";
import {
    useSession,
    useSessionContext,
    useSupabaseClient,
} from "@supabase/auth-helpers-react";

import LocaleUtils from "@date-io/date-fns";
import {
    KeyboardDateTimePicker,
    MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import ImportToGoogle from "@/components/importToGoogle";
import { Link } from "@material-ui/core";

function Google() {
    const [start, setStart] = useState<Date | null>(new Date());
    const [end, setEnd] = useState<Date | null>(new Date());
    const [eventName, setEventName] = useState<string>("");
    const [eventDescription, setEventDescription] = useState<string>("");

    const session = useSession();
    const supabase = useSupabaseClient();
    const { isLoading } = useSessionContext();

    const [sessionMock, setSessionMock] = useState<any>(null);

    const googleSignIn = async () => {
        const { error, data } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: "http://localhost:3000/Google",
                scopes: "https://www.googleapis.com/auth/calendar",
            },
        });

        if (error) {
            alert("Error logging in to Google provider with Supabase");
            console.log(error);
        } else {
            setSessionMock(data);
        }
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setSessionMock(null);
        toast.success("ออกจากระบบสำเร็จ");
    };
    async function createCalendarEvent() {
        console.log("Creating calendar event");

        if (!session || !session.provider_token) {
            alert("Please sign in first to create an event.");
            return;
        }

        const event = {
            summary: eventName,
            description: eventDescription,
            start: {
                dateTime: start?.toISOString(),
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
            end: {
                dateTime: end?.toISOString(),
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
        };

        await fetch(
            "https://www.googleapis.com/calendar/v3/calendars/primary/events",
            {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + session.provider_token,
                },
                body: JSON.stringify(event),
            }
        )
            .then((data) => {
                return data.json();
            })
            .then((data) => {
                console.log(data);
                alert("Event created, check your Google Calendar!");
            });
    }

    const handleStartChange = (date: Date | null) => {
        if (date) {
            setStart(date);
        }
    };

    const handleEndChange = (date: Date | null) => {
        if (date) {
            setEnd(date);
        }
    };

    const handleEventNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEventName(e.target.value);
    };

    const handleEventDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEventDescription(e.target.value);
    };

    return (
        <div className="h-screen bg-base-200">
            <Toaster position="bottom-right" />
            <MuiPickersUtilsProvider utils={LocaleUtils}>
                <CustomNavbar />
                <div className="flex h-full w-full justify-center items-center">
                    <div className="bg-white p-10 rounded-xl shadow-lg  w-full max-w-lg">
                        {session ? (
                            <>
                                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
                                    สวัสดี {session.user.email}
                                </h2>
                                <div className="mb-4">
                                    <label
                                        htmlFor="start"
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                    >
                                        เริ่มต้นกิจกรรมของคุณ
                                    </label>
                                    <KeyboardDateTimePicker
                                        label="เริ่มต้นกิจกรรมของคุณ"
                                        value={start}
                                        onChange={handleStartChange}
                                        className="w-full"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label
                                        htmlFor="end"
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                    >
                                        สิ้นสุดกิจกรรมของคุณ
                                    </label>
                                    <KeyboardDateTimePicker
                                        label="สิ้นสุดกิจกรรมของคุณ"
                                        value={end}
                                        onChange={handleEndChange}
                                        className="w-full"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label
                                        htmlFor="eventName"
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                    >
                                        ชื่อกิจกรรม
                                    </label>
                                    <input
                                        type="text"
                                        id="eventName"
                                        value={eventName}
                                        onChange={handleEventNameChange}
                                        className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label
                                        htmlFor="eventDescription"
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                    >
                                        คำอธิบาย
                                    </label>
                                    <input
                                        type="text"
                                        id="eventDescription"
                                        value={eventDescription}
                                        onChange={handleEventDescriptionChange}
                                        className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                </div>
                                <div className="flex justify-between">
                                    <button
                                        onClick={createCalendarEvent}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    >
                                        สร้างกิจกรรมในปฏิทิน
                                    </button>
                                    <Link href="/home">
                                        <button
                                            onClick={signOut}
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                        >
                                            ออกจากระบบ
                                        </button>
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <button
                                onClick={googleSignIn}
                                className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow transition duration-200 ease-in-out flex items-center justify-center w-full"
                            >
                                <svg
                                    className="w-4 h-4 mr-2 fill-current"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 488 512"
                                >
                                    <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
                                </svg>
                                ลงชื่อเข้าใช้ด้วย Google
                            </button>
                        )}
                        {session?.user && <hr className="mt-10" />}
                        <ImportToGoogle />
                    </div>
                </div>
            </MuiPickersUtilsProvider>
        </div>
    );
}

export default Google;
