import React from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";

function Calendar() {
  const session = useSession();
  const supabase = useSupabaseClient();
  
  async function googleSignIn() {
    if (!supabase) return; // Exit if supabase is not available
  
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/calendar'
      }
    });
  
    if (error) {
      alert("Error logging in to Google provider with Supabase");
      console.log(error);
    }
  }
  
  async function signOut() {
    await supabase.auth.signOut();
  }

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
      </div>
      <div>
        {session?
          <>
          <h2>Hey there {session.user.email}</h2>
          <button onClick={() => signOut()}>Sing Out</button>
          </>
          :
          <>
          <button onClick={() => googleSignIn()}>Sing In With Google</button>
          </>
        }
      </div>
    </div>
  );
}

export default Calendar;
