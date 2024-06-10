import React, { useState } from "react";
import { Checkbox, ListGroup } from "flowbite-react";
import AddEvent from "./Addevent";
import PostEvent from "./PostEvent";
import ImportToGoogle from "./importToGoogle";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";

export function AccordionSetting({
  fetchTrigger,
  events,
  filterClass,
  filterExam,
  test,
}: any) {
  const [checkedSubjects, setCheckedSubjects] = useState<{
    [key: string]: boolean;
  }>(() => {
    if (typeof window !== "undefined") {
      const storedSubjects = localStorage.getItem("checkedSubjects");
      if (storedSubjects) {
        return JSON.parse(storedSubjects);
      } else {
        const initialSubjects: { [key: string]: boolean } = {};
        [...filterClass, ...filterExam].forEach((subject: any) => {
          initialSubjects[subject.subjectCode] = true;
          initialSubjects["000-000"] = false;
        });

        localStorage.setItem(
          "checkedSubjects",
          JSON.stringify(initialSubjects)
        );
        return initialSubjects;
      }
    } else {
      return {};
    }
  });
  const [sessionMock, setSessionMock] = useState<any>(null);
  const displayedSubjects: string[] = [];
  const supabase = useSupabaseClient();
  const session = useSession();

  const googleSignIn = async () => {
    const { error, data } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/Google",
        scopes: "https://www.googleapis.com/auth/calendar",
      },
    });

    if (error) {
      alert("Error logging in to Google provider with Supabase");
      console.log(error);
    } else {
      setSessionMock(data);
    }
  };

  const toggleCheckbox = (subjectCode: string) => {
    setCheckedSubjects((prevState) => {
      const newState = { ...prevState, [subjectCode]: !prevState[subjectCode] };
      if (typeof window !== "undefined") {
        localStorage.setItem("checkedSubjects", JSON.stringify(newState));
      }
      test();
      return newState;
    });
  };

  

  return (
    <div className="flex flex-col bg-[#354553] p-1 rounded-lg w-72 h-4/5 shadow-[inset_0_-2px_4px_6px_rgba(0,0,0,0.2)]">
      <h2 className="flex flex-row text-md font-semibold text-center mb-2 mx-auto p-2 text-gray-400">
        ปรับแต่งปฎิทิน
      </h2>
      <ul className="px-4 p-4 mx-4 rounded-md border-2">
      <li>
        <AddEvent />
      </li>
      <li>
        <PostEvent fetchTrigger={fetchTrigger} />
      </li>
      <li>
        {session?.provider_token ? (
          <div className="mt-3">
            <ImportToGoogle />
          </div>
        ) : (
          <button
            onClick={googleSignIn}
            className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2  border border-gray-400 rounded shadow transition duration-200 ease-in-out flex items-center justify-center w-full text-sm mt-4"
          >
            <svg
              className="w-6 h-6 mr-2 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 488 512"
            >
              <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
            </svg>
            ลงชื่อเข้าใช้ด้วย Google
          </button>
        )}
      </li>
    </ul>
      <h2 className="flex flex-row text-lx font-bold text-center mb-2 mx-auto p-2 text-gray-400">
        รายวิชาของฉัน
      </h2>
      <ListGroup className="bg-[#2D3F50] border-2 mx-4 ">
        {filterClass.length > 0 || filterExam.length > 0 ? (
          <>
            {filterClass.map((subject: any) => {
              if (!displayedSubjects.includes(subject.subjectCode)) {
                displayedSubjects.push(subject.subjectCode);
                return (
                  <ListGroup.Item
                    key={subject.id}
                    className="flex items-center bg-[#2D3F50] justify-between hover:bg-[rgba(45,61,80,0.8)] rounded-md transition-colors duration-200 p-1"
                  >
                    <span className=" flex-grow text-md text-gray-400">
                      {subject.subjectCode}
                    </span>
                    <Checkbox
                      defaultChecked={checkedSubjects[subject.subjectCode]}
                      onChange={() => toggleCheckbox(subject.subjectCode)}
                      className="ml-2 "
                    />
                  </ListGroup.Item>
                );
              }
              return null;
            })}
            {filterExam.map((subject: any) => {
              if (!displayedSubjects.includes(subject.subjectCode)) {
                displayedSubjects.push(subject.subjectCode);
                return (
                  <ListGroup.Item
                    key={subject.id}
                    className="flex items-center justify-between bg-[#2D3F50] hover:bg-[rgba(45,61,80,0.8)] rounded-md transition-colors duration-200 p-1"
                  >
                    <span className="flex-grow text-md text-gray-400">
                      {subject.subjectCode}
                    </span>
                    <Checkbox
                      defaultChecked={checkedSubjects[subject.subjectCode]}
                      onChange={() => toggleCheckbox(subject.subjectCode)}
                      className="ml-2"
                    />
                  </ListGroup.Item>
                );
              }
              return null;
            })}
          </>
        ) : (
          <ListGroup.Item className="text-center text-gray-500">
            ไม่มีข้อมูลการเรียนหรือการสอบ
          </ListGroup.Item>
        )}
      </ListGroup>
    </div>
  );
}
