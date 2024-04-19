import {
  useSession,
  useSupabaseClient,
  useSessionContext,
} from "@supabase/auth-helpers-react";
import { useState, ChangeEvent, useEffect } from "react";
import DateTimePicker from "react-datetime-picker";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import { CustomNavbar } from "@/components/Navbar";
import { useAuth } from "react-oidc-context";
import axios from "axios";
function Home() {
  const [data, setData] = useState([]);
  const [start, setStart] = useState<Date>(new Date());
  const [end, setEnd] = useState<Date>(new Date());
  const [eventName, setEventName] = useState<string>("");
  const [eventDescription, setEventDescription] = useState<string>("");
  const [classDate ,setClassDate] = useState<string>();
  console.log("🚀 ~ Home ~ classDate:", classDate)

  const session = useSession();
  const supabase = useSupabaseClient();
  const { isLoading } = useSessionContext();
  const auth = useAuth();
  // console.log("token",auth.user?.access_token)

  if (isLoading) {
    return <></>;
  }
  async function googleSignIn() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        scopes: "https://www.googleapis.com/auth/calendar",
      },
    });
    if (error) {
      alert("Error logging in to Google provider with Supabase");
      console.log(error);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  async function createCalendarEvent() {
    console.log("Creating calendar event");

    if (!session || !session.provider_token) {
      alert("Please sign in first to create an event.");
      return;
    }

    const event = {
      summary: eventName,
      description: eventDescription,
      start: {
        dateTime: start.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: end.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    };

    await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + session.provider_token,
        },
        body: JSON.stringify(event),
      }
    )
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        console.log(data);
        alert("Event created, check your Google Calendar!");
      });
  }

  const handleStartChange = (date: Date | Date[] | null) => {
    if (date) {
      setStart(date instanceof Date ? date : date[0]);
    }
  };

  const handleEndChange = (date: Date | Date[] | null) => {
    if (date) {
      setEnd(date instanceof Date ? date : date[0]);
    }
  };

  const handleEventNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEventName(e.target.value);
  };

  const handleEventDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEventDescription(e.target.value);
  };

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

  const fectStudentDetail = async () => {
    if (!auth.user?.access_token) {
      console.error("Access token is not available");
      return;
    }
    try {
      const result = await axios.get(
        `https://api-gateway.psu.ac.th/Test/regist/level2/RegistData/token?eduTerm=1&eduYear=2564`,
        {
          headers: {
            credential: "api_key=JwnMeh+gj2rjD4PmSRhgbz13m9mKx2EF",
            token: auth.user.access_token,
          },
        }
      );
      setData(result.data);
      
      console.log(result.data);
    } catch (error) {
      console.error("Error fetching student detail:", error);
    }
  };
  const fectStudentClassDate = async () => {
    if (!auth.user?.access_token) {
      console.error("Access token is not available");
      return;
    }
    try {
      const result = await axios.get(
        `https://api-gateway.psu.ac.th/Test/regist/level2/StudentClassDate/token?eduTerm=1&eduYear=2563`,
        {
          headers: {
            credential: "api_key=JwnMeh+gj2rjD4PmSRhgbz13m9mKx2EF",
            token: auth.user.access_token,
          },
        }
      );
      setClassDate(result.data);
      
      console.log("classdate",result.data);
    } catch (error) {
      console.error("Error fetching student detail:", error);
    }
  };

  // console.log(session);
  // console.log(start);
  // console.log(eventName);
  // console.log(eventDescription);
  return (
    <>

      <CustomNavbar />
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="w-full mx-32 bg-white p-10 rounded-2xl border-slate-950 drop-shadow-xl">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={"dayGridMonth"}
            headerToolbar={{
              start: "dayGridMonth,timeGridWeek,timeGridDay",
              center: "title",
              end: "today prev,next,",
            }}
            height={"70vh"}
            events={events}
          />
        </div>
     
      </div>
    </>
  );
}
export default Home;
