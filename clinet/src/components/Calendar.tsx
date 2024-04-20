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
    <>
    <div className="flex flex-col mx-auto w-3/4">
    <div className="flex justify-center gap-4">
    <select id="small" className="w-1/4 block  p-2 mb-6 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        <option selected>ชั้นปี</option>
        <option value="US">United States</option>
        <option value="CA">Canada</option>
        <option value="FR">France</option>
        <option value="DE">Germany</option>
      </select>
      <select id="small" className="w-1/4 block  p-2 mb-6 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        <option selected>ภาคเรียน</option>
        <option value="US">United States</option>
        <option value="CA">Canada</option>
        <option value="FR">France</option>
        <option value="DE">Germany</option>
      </select>
      </div>
    <div className="w-full  bg-white p-10 rounded-2xl border-slate-950 drop-shadow-xl">
        
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
    </div>
    </>
  );
}
