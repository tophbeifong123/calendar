import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid/index.js";
import timeGridPlugin from "@fullcalendar/timegrid/index.js";
import interactionPlugin from "@fullcalendar/interaction/index.js";
import ModalInfo from "./ModalInfo";
import Addevent from "./Addevent";
import listPlugin from '@fullcalendar/list';
import bootstrapPlugin from '@fullcalendar/bootstrap';
export default function CustomCalendar({ details, events }: any) {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectEvent, setSelectEvents] = useState<any>(null);
  const [years, setYears] = useState<number[]>([]);
  const [initialDate, setInitialDate] = useState<string>("2020-07-01");
  const [newEvent, setNewEvent] = useState<any>([]);

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
          <Addevent />
          add calendar
        </div>
        <div className="w-5/6 bg-white p-7 rounded-3xl border-slate-900 drop-shadow-2xl z-0">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
            initialView={"dayGridMonth"}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            height={"80vh"}
            events={events}
            eventClick={handleEventClick}
            initialDate={initialDate}
            dateClick={handleDateClick}
            selectable={true}
            select={handleSelectedDates}
            themeSystem= 'default'
            navLinks= {true}
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
