import React, { ChangeEvent, useState } from "react";
import { CustomNavbar } from "@/components/Navbar";
import SlideBar from "@/components/SlideBar";
import {
  useSession,
  useSessionContext,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";

import LocaleUtils from "@date-io/date-fns";
import { KeyboardDateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

function Google() {
  const [start, setStart] = useState<Date | null>(new Date());
  const [end, setEnd] = useState<Date | null>(new Date());
  const [eventName, setEventName] = useState<string>("");
  const [eventDescription, setEventDescription] = useState<string>("");

  const session = useSession();
  const supabase = useSupabaseClient();
  const { isLoading } = useSessionContext();

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
        dateTime: start?.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: end?.toISOString(),
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

  const handleStartChange = (date: Date | null) => {
    if (date) {
      setStart(date);
    }
  };

  const handleEndChange = (date: Date | null) => {
    if (date) {
      setEnd(date);
    }
  };

  const handleEventNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEventName(e.target.value);
  };

  const handleEventDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEventDescription(e.target.value);
  };

  console.log(session);
  console.log(start);
  console.log(eventName);
  console.log(eventDescription);

  return (
    <>
    <MuiPickersUtilsProvider utils={LocaleUtils}>
      <CustomNavbar />
      <div className="flex h-screen bg-blue-50">
        <SlideBar />
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
                 <KeyboardDateTimePicker
                  label="Start Date and Time"
                  value={start}
                  onChange={handleStartChange}
                  initialFocusedDate={null}
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="end"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  End of your event
                </label>
                <KeyboardDateTimePicker
                  label="End Date and Time"
                  value={end}
                  onChange={handleEndChange}
                  initialFocusedDate={null}
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
      </MuiPickersUtilsProvider>
    </>
  );
}

export default Google;
