import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import ModalInfo from "./ModalInfo";

function Calendar({ events }: any) {
  const handleEventClick = (clickInfo: any) => {
    // alert(`Event ${clickInfo.event.title} `);
  
  };

  return (
    <div className="w-full  mx-40 bg-white p-10 rounded-2xl border-slate-950 drop-shadow-xl ">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={"dayGridMonth"}
        headerToolbar={{
          start: "dayGridMonth,timeGridWeek,timeGridDay",
          center: "title",
          end: "today prev,next",
        }}
        height={"60vh"}
        events={events}
        eventClick={handleEventClick} 
      />
    </div>
  );
}

export default Calendar;
