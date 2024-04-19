import {
    useSession,
    useSupabaseClient,
    useSessionContext,
  } from "@supabase/auth-helpers-react";
  import { useState, ChangeEvent } from "react";
  import DateTimePicker from "react-datetime-picker";
  import dayGridPlugin from "@fullcalendar/daygrid";
  import timeGridPlugin from "@fullcalendar/timegrid";
  import interactionPlugin from "@fullcalendar/interaction";
  import FullCalendar from "@fullcalendar/react";
  
  function App() {
    const [start, setStart] = useState<Date>(new Date());
    const [end, setEnd] = useState<Date>(new Date());
    const [eventName, setEventName] = useState<string>("");
    const [eventDescription, setEventDescription] = useState<string>("");
  
    const session = useSession();
    const supabase = useSupabaseClient();
    const { isLoading } = useSessionContext();
  
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
  
    console.log(session);
    console.log(start);
    console.log(eventName);
    console.log(eventDescription);
    return (
      <div className="App flex justify-center items-center h-screen bg-gray-100">
        <div className="w-2/3 mr-20 bg-white p-10 rounded-2xl border-slate-950 drop-shadow-xl">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, ]}
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
        <div className="bg-white p-10 rounded-xl drop-shadow-xl">
          <h2 className="text-center">import Calendar</h2>
          {session ? (
            <>
              <h2 className="text-2xl mb-4">Hey there {session.user.email}</h2>
              <div className="mb-4">
                <label
                  htmlFor="start"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Start of your event
                </label>
                <DateTimePicker
                  onChange={handleStartChange}
                  value={start}
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="end"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  End of your event
                </label>
                <DateTimePicker
                  onChange={handleEndChange}
                  value={end}
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="eventName"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Event name
                </label>
                <input
                  type="text"
                  id="eventName"
                  onChange={handleEventNameChange}
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="eventDescription"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Event description
                </label>
                <input
                  type="text"
                  id="eventDescription"
                  onChange={handleEventDescriptionChange}
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="flex justify-between">
                <button
                  onClick={() => createCalendarEvent()}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Create Calendar Event
                </button>
                <button
                  onClick={() => signOut()}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={() => googleSignIn()}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline "
              >
              Sign In With Google
            </button>
          )}
        </div>
      </div>
    );
  }
  export default App;
  