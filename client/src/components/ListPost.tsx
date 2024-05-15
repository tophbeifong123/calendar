import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import conf from "@/conf/main";
import { Button, Select } from "flowbite-react";
import PostEvent from "./PostEvent";
import { ProfileAuthContext } from "@/contexts/Auth.context";
import toast, { Toaster } from "react-hot-toast";

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

function ListPost({ fetchPost, subjectData }: any) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newFetch, setNewFetch] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const value = useContext(ProfileAuthContext);
  const [vote, setVote] = useState<number>(0);

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
  }, [fetchPost, selectedSubject, newFetch]);

  const handleDelete = async (id: number) => {
    try {
      const resDelete = await axios.delete(
        `${conf.apiUrlPrefix}/schedules/${id}`
      );
      setNewFetch(!newFetch);
      toast.success("ลบประกาศสำเร็จแล้ว");
      console.log("resDelete", resDelete);
    } catch (error) {
      console.error("Error delete post:", error);
    }
  };

  const VoteUpdate = async (id: number, vote: number) => {
    try {
      const response = await axios.put(`${conf.apiUrlPrefix}/schedules/${id}`, {
        vote: vote + 1,
        votedBy: { id: value.user?.id ?? 0 },
      });
      toast.success("โหวตสำเร็จแล้ว!!");
      setNewFetch(!newFetch);
    } catch (error) {
      console.error("Error update vote:", error);
      toast.error("เกิดข้อผิดพลาดในการโหวต");
    }
  };

  return (
    <>
      <button
        className="btn btn-circle fixed bg-[#ebebeb] bottom-48 right-28 z-5 rounded-full p-2 shadow-sm w-[50px] h-[50px] z-10"
        onClick={() => setModalOpen(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
          />
        </svg>
      </button>
      <label className="fixed  bottom-52 right-10 z-5 rounded-full z-10">ประกาศ</label>
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
                      ) : (
                        <p className="text-center text-gray-500">ไม่มีรูปภาพ</p>
                      )}
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
                        {new Date(post.startTime).toLocaleString()}
                      </p>
                      <p>
                        <strong>สิ้นสุดเมื่อ:</strong>{" "}
                        {new Date(post.stopTime).toLocaleString()}
                      </p>
                      <p>
                        <strong>ผู้โพสต์:</strong> {post.createBy.studentId}
                      </p>
                      <p>
                        <strong>รับทราบแล้ว:</strong> {post.vote} คน
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
                              post.votedBy &&
                              post.votedBy.studentId === value.user?.studentId;
                            if (!isVotedByCurrentUser) {
                              VoteUpdate(post.id, post.vote);
                            }
                          }}
                          disabled={
                            post.votedBy &&
                            post.votedBy.studentId === value.user?.studentId
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
