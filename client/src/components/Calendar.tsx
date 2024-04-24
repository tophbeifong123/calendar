import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid/index.js";
import timeGridPlugin from "@fullcalendar/timegrid/index.js";
import interactionPlugin from "@fullcalendar/interaction/index.js";
import ModalInfo from "./ModalInfo";
import Addevent from "./Addevent";

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
      <div className="flex justify-center items-center mx-auto w-full h-screen">
        <div className="relative right-20 bottom-20 flex flex-col	items-center space-y-12">
          <Addevent/>
            add calendar
        </div>
          <div className="w-3/4 bg-white p-8 rounded-2xl border-slate-900 drop-shadow-xl z-0">
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
