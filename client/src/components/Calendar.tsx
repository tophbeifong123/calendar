import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid/index.js";
import timeGridPlugin from "@fullcalendar/timegrid/index.js";
import interactionPlugin from "@fullcalendar/interaction/index.js";
import ModalInfo from "./ModalInfo";
import Addevent from "./Addevent";
import listPlugin from "@fullcalendar/list";
import settingLogo from "../assets/icon/setting.svg";
import { AccordionSetting } from "./AccordionSetting";

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
  console.log("events", events);
  useEffect(() => {
    const storedSubjects = localStorage.getItem("checkedSubjects");
    const checkedSubjects = storedSubjects ? JSON.parse(storedSubjects) : {};

    if (Array.isArray(events)) {
      const allFalse = Object.values(checkedSubjects).every(
        (value) => value === true
      );
      if (allFalse) {
        setFilteredEvents([...events, ...holidayDateFormat]);
      } else {
        const filteredEvents = events.filter(
          (event: any) => checkedSubjects[event.subjectCode]
        );
        const combinedEvents = [...filteredEvents, ...holidayDateFormat];
        console.log("filteredEvents", combinedEvents);
        setFilteredEvents(combinedEvents);
      }
    } else {
      console.error("Events is not an array:", events);
    }
  }, [events, test]);

  console.log("test events", filteredEvents);

  const handleEventClick = (clickInfo: any) => {
    setSelectEvents(clickInfo.event);
    setModalOpen(true);
  };

  const handleDateClick = (arg: any) => {
    alert(arg.dateStr);
  };

  const handleSelectedDates = (info: any) => {
    alert("selected " + info.startStr + " to " + info.endStr);
    const title = prompt("What's the name of the title");
    console.log(info);
    if (title != null) {
      const newEventData = {
        title,
        start: info.startStr,
        end: info.endStr,
      };
      const updatedEvents = [...events, newEventData];
      setNewEvent(updatedEvents);
      console.log("here", updatedEvents);
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
          <a className="mt-3">Add Calendar</a>
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
