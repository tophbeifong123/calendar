import { useContext, useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid/index.js";
import timeGridPlugin from "@fullcalendar/timegrid/index.js";
import interactionPlugin from "@fullcalendar/interaction/index.js";
import ModalInfo from "./ModalInfo";
import Addevent from "./PostEvent";
import listPlugin from "@fullcalendar/list";
import settingLogo from "../assets/icon/setting.svg";
import { AccordionSetting } from "./AccordionSetting";
import axios from "axios";
import conf from "@/conf/main";
import { useAuth } from "react-oidc-context";
import { ProfileAuthContext } from "@/contexts/Auth.context";
import PostEvent from "./PostEvent";
import AddEvent from "./Addevent";
import ListPost from "./ListPost";
import { useSession } from "@supabase/auth-helpers-react";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "flowbite-react";

export default function CustomCalendar({
  details,
  events,
  filterClass,
  filterExam,
  postDateFormat,
  holidayDateFormat,
}: any) {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectEvent, setSelectEvents] = useState<any>(null);
  const [initialDate, setInitialDate] = useState<string>("2020-07-01");
  const [newEvent, setNewEvent] = useState<any>([]);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [test, setTest] = useState<boolean>(true);
  const [modalAddEvent, setModalAddEvent] = useState<Boolean>(false);
  const value = useContext(ProfileAuthContext);
  const session = useSession();

  console.log(selectEvent);

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

  const eventsWithoutId = value.user?.events
    ? value.user.events.map((event) => {
        const { id, ...rest } = event;
        return {
          id,
          ...rest,
          backgroundColor: "#B3E0E3",
          borderColor: "#9AD1D4",
        };
      })
    : [];

  useEffect(() => {
    const storedSubjects = localStorage.getItem("checkedSubjects");
    const checkedSubjects = storedSubjects ? JSON.parse(storedSubjects) : {};

    if (Array.isArray(events)) {
      const allFalse = Object.values(checkedSubjects).every(
        (value) => value === true
      );
      if (allFalse) {
        setFilteredEvents([
          ...events,
          ...postDateFormat,
          ...holidayDateFormat,
          ...(eventsWithoutId ?? []),
        ]);
      } else {
        const filteredEvents = events.filter(
          (event: any) => checkedSubjects[event.subjectCode]
        );
        const combinedEvents = [
          ...filteredEvents,
          ...postDateFormat,
          ...holidayDateFormat,
          ...(eventsWithoutId ?? []),
        ];
        console.log("combinedEventsData", combinedEvents);
        setFilteredEvents(combinedEvents);
      }
    } else {
      console.error("Events is not an array:", events);
    }
  }, [events, test, value.user]);

  const handleEventClick = (clickInfo: any) => {
    setSelectEvents(clickInfo.event);
    setModalOpen(true);
  };

  const handleDateClick = (arg: any) => {
    alert(arg.dateStr);
  };

  const handleSelectedDates = async (info: any) => {
    alert("เลือกวันที่ " + info.startStr + " ถึง " + info.endStr);
    const title = prompt("ชื่อกิจกรรม");
    const description = prompt("รายละเอียด");

    if (title != null && description != null) {
      let createdEventId: string = "";

      const newEventGoogle: EventGoogle = {
        summary: title || "ไม่ระบุ",
        description: description || "ไม่ระบุ",
        start: {
          dateTime: `${info.startStr}T00:00:00`,
          timeZone: "Asia/Bangkok",
        },
        end: {
          dateTime: `${info.endStr}T00:00:00`,
          timeZone: "Asia/Bangkok",
        },
        recurrence: [],
        colorId: "9",
      };

      try {
        if (value.user?.google) {
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
            toast.error("Failed to create event on Google Calendar");
            return;
          }
        }

        const newEventData: EventData = {
          title: title || "ไม่ระบุ",
          description: description || "ไม่ระบุ",
          start: info.startStr,
          end: info.endStr,
          eventIdGoogle: createdEventId,
          user: { id: value.user?.id ?? 0 },
        };

        console.log("new event data", newEventData);

        const postNewEvent = await axios.post(
          `${conf.apiUrlPrefix}/event`,
          newEventData
        );

        console.log("Created event in backend:", postNewEvent);

        if (value.triggerFetch) {
          value.triggerFetch();
        }

        toast.success("สร้างกิจกรรมสำเร็จแล้ว");
      } catch (error) {
        console.error("Error creating event:", error);
        toast.error("สร้างกิจกรรมไม่สำเร็จ");
      }
    } else {
      console.log("No title or description provided");
    }
  };

  const toggleTest = () => {
    setTest((prevTest) => !prevTest);
  };

  return (
    <>
      <div className="flex justify-center items-center  w-full h-screen mb-10">
        <div className="items-center relative bottom-20 flex flex-col mx-auto">
          <PostEvent />

          <AccordionSetting
            events={events}
            filterClass={filterClass}
            filterExam={filterExam}
            test={toggleTest}
          />
        </div>
        <div className="w-5/6 bg-white p-7 rounded-3xl border-slate-900 drop-shadow-2xl z-0 mr-16">
          <FullCalendar
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            initialView={"dayGridMonth"}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            height={"80vh"}
            events={filteredEvents}
            eventClick={handleEventClick}
            initialDate={initialDate}
            dateClick={handleDateClick}
            selectable={true}
            select={handleSelectedDates}
            themeSystem="default"
            navLinks={true}
          />
          <ModalInfo
            event={selectEvent}
            openModal={modalOpen}
            onClose={() => setModalOpen(false)}
          />
        </div>
        <AddEvent />
      </div>
    </>
  );
}
