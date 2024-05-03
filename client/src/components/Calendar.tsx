import { useContext, useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid/index.js";
import timeGridPlugin from "@fullcalendar/timegrid/index.js";
import interactionPlugin from "@fullcalendar/interaction/index.js";
import ModalInfo from "./ModalInfo";
import Addevent from "./Addevent";
import listPlugin from "@fullcalendar/list";
import settingLogo from "../assets/icon/setting.svg";
import { AccordionSetting } from "./AccordionSetting";
import axios from "axios";
import conf from "@/conf/main";
import { useAuth } from "react-oidc-context";
import { ProfileAuthContext } from "@/contexts/Auth.context";

export default function CustomCalendar({
  details,
  events,
  filterClass,
  filterExam,
  holidayDateFormat,
}: any) {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectEvent, setSelectEvents] = useState<any>(null);
  const [initialDate, setInitialDate] = useState<string>("2020-07-01");
  const [newEvent, setNewEvent] = useState<any>([]);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [test, setTest] = useState<boolean>(true);
  const value = useContext(ProfileAuthContext);

  interface EventData {
    title: string;
    description: string;
    start: string;
    end: string;
    user: {
      id: number;
    } | null;
  }

  const test11: [{
    title: string;
    description: string;
    start: string;
    end: string;
    borderColor:string;
    backgroundColor:string;
  }] = [{
    
    description: "test test",
    start: "2020-07-01",
    end: "2020-07-02",
    borderColor: "#9AD1D4",
    backgroundColor: "#B3E0E3",
    title: "test first event",
  }];

  const eventsWithoutId = value.user?.events ? value.user.events.map(event => {
    const { id, ...rest } = event;
    return { ...rest, backgroundColor: "#B3E0E3", borderColor: "#9AD1D4", };
  }) : [];

  console.log("78901",filteredEvents);
  useEffect(() => {
    const storedSubjects = localStorage.getItem("checkedSubjects");
    const checkedSubjects = storedSubjects ? JSON.parse(storedSubjects) : {};

    if (Array.isArray(events)) {
      const allFalse = Object.values(checkedSubjects).every(
        (value) => value === true
      );
      if (allFalse) {
        setFilteredEvents([...events, ...holidayDateFormat, ...(eventsWithoutId ?? [])]);
      } else {
        const filteredEvents = events.filter(
          (event: any) => checkedSubjects[event.subjectCode]
        );
        const combinedEvents = [
          ...filteredEvents,
          ...holidayDateFormat,
          ...(eventsWithoutId ?? [])
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

    if (title != null) {
      const newEventData: EventData = {
        title: title || "ไม่ระบุ",
        description: description || "ไม่ระบุ",
        start: info.startStr,
        end: info.endStr,
        user: { id: value.user?.id ?? 0 },
      };

      try {
        const postNewEvent = await axios.post(
          `${conf.apiUrlPrefix}/event`,
          newEventData
        );
        console.log("new event", postNewEvent);
      } catch (error) {
        console.error("Error posting new event:", error);
      }
    } else {
      console.log("nothing");
    }
  };

  const toggleTest = () => {
    setTest((prevTest) => !prevTest);
  };

  return (
    <>
      <div className="flex justify-center items-center  w-full h-screen">
        <div className="items-center relative bottom-20 flex flex-col mx-auto">
          <Addevent />
          <a className="mt-3">Edit</a>
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
      </div>
    </>
  );
}