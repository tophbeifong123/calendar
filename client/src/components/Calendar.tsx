import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid/index.js";
import timeGridPlugin from "@fullcalendar/timegrid/index.js";
import interactionPlugin from "@fullcalendar/interaction/index.js";
import ModalInfo from "./ModalInfo";

export default function CustomCalendar({ details, events }: any) {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectEvent, setSelectEvents] = useState<any>(null);
  const [years, setYears] = useState<number[]>([]);

  const handleEventClick = (clickInfo: any) => {
    setSelectEvents(clickInfo.event);
    setModalOpen(true);
  };

  useEffect(() => {
    if (details && details.admitYear) {
      const initialYear = parseInt(details.admitYear);
      const yearsArray = Array.from({ length: 8 }, (_, i) => initialYear + i);
      setYears(yearsArray);
    }
  }, [details]);

  return (
    <>
      <div className="flex flex-col mx-auto w-3/4">
        <div className="flex justify-center gap-4">
          <label className="block mt-2 text-sm font-medium text-gray-900 dark:text-white items-center">
            ปีการศึกษา
          </label>
          <select
            id="small"
            className="w-1/4 block  p-2 mb-6 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option selected>**ทั้งหมด**</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <label className="block mt-2 text-sm font-medium text-gray-900 dark:text-white items-center">
            ภาคเรียน
          </label>
          <select
            id="small"
            className="w-1/4 block  p-2 mb-6 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option selected>**ทั้งหมด**</option>
            <option value="1">1</option>
            <option value="2">2</option>
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
