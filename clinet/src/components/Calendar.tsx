import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ModalInfo from "./ModalInfo";

export default function CustomCalendar({ events }: any) {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectEvent ,setSelectEvents] = useState<any>(null);

  const handleEventClick = (clickInfo: any) => {
    setSelectEvents(clickInfo.event);
    setModalOpen(true);
  };

  return (
    <div className="w-full mx-40 bg-white p-10 rounded-2xl border-slate-950 drop-shadow-xl">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={"dayGridMonth"}
        headerToolbar={{
          start: "dayGridMonth,timeGridWeek,timeGridDay",
          center: "title",
          end: "today prev,next,",
        }}
        height={"60vh"}
        events={events}
        eventClick={handleEventClick}
      />
      <ModalInfo event={selectEvent} openModal={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
