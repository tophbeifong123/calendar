import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import conf from "@/conf/main";
import { Button, Select } from "flowbite-react";
import { ProfileAuthContext } from "@/contexts/Auth.context";
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "@supabase/auth-helpers-react";
interface Post {
  id: number;
  subjectCode: string;
  title: string;
  description: string;
  startTime: string;
  stopTime: string;
  image: string;
  vote: number;
  createdDate: string;
  createBy: {
    id: number;
    studentId: string;
  };
  votedBy: {
    id: number;
    studentId: string;
  };
}

interface EventGoogle {
  summary: string;
  description: string;
  start: any;
  end: any;
  // recurrence: any;
  colorId: string;
}

function ListPost({ fetchPost, subjectData, fetchTrigger }: any) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newFetch, setNewFetch] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const value = useContext(ProfileAuthContext);
  const session = useSession();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = `${conf.apiUrlPrefix}/schedules`;

        if (selectedSubject) {
          url += `?subjectCode=${selectedSubject}`;
        }

        const response = await axios.get<Post[]>(url);
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchData();
  }, [fetchPost, selectedSubject, newFetch, fetchTrigger]);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${conf.apiUrlPrefix}/schedules/${id}`);
      setNewFetch(!newFetch);
      toast.success("ลบประกาศสำเร็จแล้ว");
      fetchTrigger();
    } catch (error) {
      console.error("Error delete post:", error);
    }
  };

  const VoteUpdate = async (id: number, vote: number) => {
    try {
      await axios.put(`${conf.apiUrlPrefix}/schedules/${id}`, {
        vote: vote + 1,
        votedBy: { id: value.user?.id ?? 0 },
      });
      toast.success("โหวตสำเร็จแล้ว!!");
      setNewFetch(!newFetch);
    } catch (error) {
      console.error("Error updating vote:", error);
      toast.error("เกิดข้อผิดพลาดในการโหวต");
    }
  };

  const test = async () => {
    const newEventGoogleee = {
      summary: "tedddst",
      start: {
        dateTime: `2024-06-09T20:07:07.997Z`,
        timeZone: "Asia/Bangkok",
      },
      end: {
        dateTime: `2024-06-09T20:09:07.997Z`,
        timeZone: "Asia/Bangkok",
      },
      recurrence: [],
      colorId: "9",
    };
    try {
      const responseGoogle = await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + session?.provider_token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newEventGoogleee),
        }
      );
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };
  function adjustTimeByHours(dateTime:any, hours:any) {
    const date = new Date(dateTime);
    date.setHours(date.getHours() + hours);
    return date.toISOString();
}

  const UpdateGoogle = async (
    title: any,
    description: any,
    startDate: any,
    endDate: any,
    subjectCode: any
  ) => {
    if (value.user?.google) {
      try {
        const startDateTime = adjustTimeByHours(startDate, -7);
        const endDateTime = adjustTimeByHours(endDate, -7);

        const newEventGoogle = {
          summary: `${subjectCode} ${title}`,
          description: description,
          start: {
            dateTime: startDateTime,
            timeZone: "Asia/Bangkok",
          },
          end: {
            dateTime: endDateTime,
            timeZone: "Asia/Bangkok",
          },
          recurrence: [],
          colorId: "10",
        };

        console.log("New Google Calendar event:", newEventGoogle);

        const token = session?.provider_token;
        const responseGoogle = await fetch(
          "https://www.googleapis.com/calendar/v3/calendars/primary/events",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newEventGoogle),
          }
        );
      } catch (error) {
        console.error("Fetch error:", error);
      }
    } else {
      console.error("User's Google account is not linked");
      toast.error("Google account is not linked");
    }
  };

  return (
    <>
      <button
        className="btn btn-circle fixed bg-[#ebebeb] bottom-[160px] left-5 z-5 rounded-full p-2 shadow-sm w-[45px] h-[45px] z-10"
        onClick={() => setModalOpen(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
          />
        </svg>
      </button>
      <label className="fixed  bottom-[173px] left-[70px] z-5 rounded-full z-10 text-left">
        ประกาศ
      </label>
      <Toaster position="bottom-right" />
      {modalOpen && (
        <div className="modal-overlay fixed flex justify-center items-center top-0 left-0 z-10 bg-black bg-opacity-50 w-full h-full">
          <div className="modal-box p-6 bg-white rounded-lg shadow-lg">
            <div className="mx-8">
              <Select
                value={selectedSubject}
                onChange={(e: any) => {
                  setSelectedSubject(e.target.value);
                }}
              >
                <option value="">ทั้งหมด</option>
                {subjectData
                  .filter(
                    (subject: any, index: number, self: any) =>
                      index ===
                      self.findIndex(
                        (s: any) =>
                          s.subjectNameThai === subject.subjectNameThai
                      )
                  )
                  .map((subject: any, index: number) => (
                    <option key={index} value={subject.subjectCode}>
                      {subject.subjectNameThai}
                    </option>
                  ))}
              </Select>
            </div>
            <form method="dialog">
              <button
                className="btn btn-md btn-circle btn-ghost absolute right-2 top-2"
                onClick={() => setModalOpen(false)}
              >
                ✕
              </button>
            </form>
            <div className="grid grid-cols-1">
              {posts.length > 0 ? (
                posts.map((post, index) => (
                  <div
                    key={index}
                    className="card card-compact w-96 bg-base-100 shadow-xl mt-10 mx-auto"
                  >
                    <div className="flex ml-7 mt-3">
                      {post.vote >= 5 ? (
                        <div className="badge bg-[#C3FF93] mr-4">
                          ยืนยันแล้ว
                        </div>
                      ) : post.vote < 5 ? (
                        <div className="badge badge-ghost mr-4">
                          ยังไม่ยืนยัน
                        </div>
                      ) : null}
                      {new Date(post.createdDate).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>

                    <figure>
                      {post.image ? (
                        <img
                          src={post.image}
                          alt="Post Image"
                          className="h-[240px] mt-3 "
                        />
                      ) : null}
                    </figure>
                    <div className="card-body">
                      <h2 className="card-title">
                        {post.title}{" "}
                        <div className="badge badge-accent">
                          {post.subjectCode}
                        </div>
                      </h2>
                      <p>{post.description}</p>
                      <p>
                        <strong>เริ่มต้นเมื่อ:</strong>{" "}
                        {post.startTime.substring(0, 10)}{" "}
                        {post.startTime.substring(11, 19)}
                      </p>
                      <p>
                        <strong>สิ้นสุดเมื่อ:</strong>{" "}
                        {post.stopTime.substring(0, 10)}{" "}
                        {post.stopTime.substring(11, 19)}
                      </p>
                      <p>
                        <strong>ผู้โพสต์:</strong> {post.createBy.studentId}
                      </p>
                      <p>
                        <strong>ยืนยันแล้ว:</strong> {post.vote} คน
                      </p>
                      <div className="card-actions justify-end">
                        {value.user?.studentId === post.createBy.studentId && (
                          <button
                            className="btn btn-secondary"
                            onClick={() => handleDelete(post.id)}
                          >
                            ลบประกาศ
                          </button>
                        )}
                        <button
                          className="btn btn-info"
                          onClick={() => {
                            const isVotedByCurrentUser =
                              post.votedBy?.studentId === value.user?.studentId;
                            if (!isVotedByCurrentUser) {
                              VoteUpdate(post.id, post.vote);
                              UpdateGoogle(
                                post.title,
                                post.description,
                                post.startTime,
                                post.stopTime,
                                post.subjectCode
                              );
                            }
                          }}
                          disabled={
                            post.votedBy?.studentId === value.user?.studentId
                          }
                        >
                          ยืนยัน/รับทราบ
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center my-10">ไม่มีประกาศ</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ListPost;
