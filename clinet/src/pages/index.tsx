import React from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import Link from "next/link";

function Calendar() {
  const events = [
    {
      title: "กินข้าวกับครอบครัว",
      start: new Date().setHours(18, 30),
      end: new Date().setHours(20, 30),
      allDay: false,
    },
    {
      title: "ออกกำลังกาย",
      start: new Date("2024-04-20"),
      end: new Date("2024-04-20"),
      allDay: true,
    },
  ];
  return (
    <div className="h-screen px-[15vh] pt-[7vh]">
      <div className="">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={"dayGridMonth"}
          headerToolbar={{
            start: "today prev,next",
            center: "title",
            end: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          height={"70vh"}
          events={events}
        />
        <Link href="#_">
          <button className="mt-10 text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
            Google & calendar
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Calendar;
