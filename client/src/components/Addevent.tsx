import React, { useState, useEffect, useContext } from "react";
import { Button } from "flowbite-react";
import {
  KeyboardDateTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import axios from "axios";
import conf from "@/conf/main";
import { useAuth } from "react-oidc-context";
import { ProfileAuthContext } from "@/contexts/Auth.context";
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "@supabase/auth-helpers-react";
interface EventData {
  title: string;
  description: string;
  start: string;
  end: string;
  eventIdGoogle: string;
  user: {
    id: number;
  } | null;
}

interface EventGoogle {
  summary: string;
  description: string;
  start: any;
  end: any;
  recurrence: [];
  colorId: string;
}

function AddEvent() {
  const auth = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const value = useContext(ProfileAuthContext);
  const session = useSession();

  useEffect(() => {
    if (auth.isAuthenticated) {
    } else {
      console.log("No access token available");
    }
  }, [auth]);

  const addEvent = async () => {
    try {
      if (!auth?.user) {
        console.error("User not authenticated");
        return;
      }
    
      console.log("yoto",startDate.toISOString(), endDate.toISOString());
      const newEventGoogle: EventGoogle = {
        summary: title || "ไม่ระบุ",
        description: detail || "ไม่ระบุ",
        start: {
          dateTime: startDate.toISOString(),
          timeZone: "Asia/Bangkok",
        },
        end: {
          dateTime: endDate.toISOString(),
          timeZone: "Asia/Bangkok",
        },
        recurrence: [],
        colorId: "9",
      };

      let createdEventId: string = "";

      if (value.user?.google) {
        console.log("res",newEventGoogle);
        const responseGoogle = await fetch(
          "https://www.googleapis.com/calendar/v3/calendars/primary/events",
          {
            method: "POST",
            headers: {
              Authorization: "Bearer " + session?.provider_token,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newEventGoogle),
          }
        );
        if (responseGoogle.ok) {
          const createdEvent = await responseGoogle.json();
          createdEventId = createdEvent.id;
          console.log("Event ID:", createdEvent.id);
        } else {
          console.error(
            "Failed to create event on Google:",
            responseGoogle.statusText
          );
        }
        console.log("Created event on google:", responseGoogle);
      }
      const newEventData: EventData = {
        title: title || "ไม่ระบุ",
        description: detail || "ไม่ระบุ",
        start: startDate.toISOString(),
        end: startDate.toISOString(),
        eventIdGoogle: createdEventId,
        user: { id: value.user?.id ?? 0 },
      };

      const response = await axios.post(
        `${conf.apiUrlPrefix}/event`,
        newEventData
      );

      console.log("Created event:", response);
      if (value.triggerFetch) {
        value.triggerFetch();
      }
      toast.success("สร้างกิจกรรมสำเร็จแล้ว");
      resetForm();
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("สร้างกิจกรรมไม่สำเร็จ");
    }
  };

  const resetForm = () => {
    setTitle("");
    setDetail("");
    setStartDate(new Date());
    setEndDate(new Date());
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <>
        <button
          className="btn z-5 rounded-full p-2 shadow-sm w-[45px] h-[45px]"
          onClick={() => setModalOpen(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
            />
          </svg>
        </button>
        <label className="rounded-full relative left-5">
          สร้างกิจกรรม
        </label>
        {modalOpen && (
          <div
            className={`modal-overlay fixed flex justify-center items-center top-0 left-0 z-10 bg-black bg-opacity-50 w-full h-full`}
          >
            <div className="modal-box">
              <form method="dialog">
                <button
                  className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                  onClick={() => setModalOpen(false)}
                >
                  ✕
                </button>
              </form>
              <h3 className="font-bold text-lg bg-n text-center">
                สร้างกิจกรรม
              </h3>
              <p className="pt-4">
                <label className="form-control ">
                  <div className="label">
                    <span className="block text-gray-700 text-sm font-bold mb-2">
                      ชื่อกิจกรรม
                    </span>
                  </div>
                  <input
                    type="text"
                    placeholder="หัวข้อเรื่อง"
                    className="input input-bordered w-full "
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </label>
                <label className="form-control w-full">
                  <div className="label">
                    <span className="block text-gray-700 text-sm font-bold mb-2 mt-2">
                      รายละเอียด
                    </span>
                  </div>
                  <textarea
                    placeholder="รายละเอียด"
                    className="textarea textarea-bordered w-full"
                    rows={4}
                    value={detail}
                    onChange={(e) => setDetail(e.target.value)}
                  />
                </label>
                <div className="flex justify-between mb-4 mt-4">
                  <div className="w-1/2 pr-2">
                    <KeyboardDateTimePicker
                      label="วันที่และเวลาเริ่มต้น"
                      value={startDate}
                      onChange={(date) => date && setStartDate(date)}
                      format="dd/MM/yyyy HH:mm"
                    />
                  </div>
                  <div className="w-1/2 pl-2">
                    <KeyboardDateTimePicker
                      label="วันที่และเวลาสิ้นสุด"
                      value={endDate}
                      onChange={(date) => date && setEndDate(date)}
                      format="dd/MM/yyyy HH:mm"
                    />
                  </div>
                </div>
              </p>
              <Button
                gradientDuoTone="pinkToOrange"
                className="px-6 mt-6 mx-auto "
                onClick={() => {
                  setModalOpen(false);
                  addEvent();
                }}
              >
                สร้าง
              </Button>
            </div>
          </div>
        )}
      </>F
    </MuiPickersUtilsProvider>
  );
}

export default AddEvent;
