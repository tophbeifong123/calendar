import React, { useState, useEffect, useContext } from "react";
import { Button, FileInput, Label, Select } from "flowbite-react";
import {
  KeyboardDateTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import axios from "axios";
import conf from "@/conf/main";
import { useAuth } from "react-oidc-context";
import { ProfileAuthContext } from "@/contexts/Auth.context";
import toast, { Toaster } from "react-hot-toast";
import ListPost from "./ListPost";

function PostEvent() {
  const auth = useAuth();
  const [modalOpen, setModalOpen] = useState<Boolean>(false);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [subjectType, setSubjctType] = useState<any>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [detail, setDetail] = useState<string>("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<string>("");
  const [reloadPosts, setReloadPosts] = useState<Boolean>(false);
  const value = useContext(ProfileAuthContext);
  // console.log("selectedSubject", selectedSubject);
  useEffect(() => {
    if (auth.isAuthenticated) {
      fetchSubject();
    } else {
      console.log("No access token available");
    }
  }, [auth]);

  const handlePostSuccess = () => {
    setReloadPosts((prevState) => !prevState);
  };

  const PostEvent = async () => {
    try {
      if (!auth?.user) {
        console.error("User not authenticated");
        return;
      }
      const formData = new FormData();
      if (photo) {
        formData.append("image", photo);
      }

      const uploadResponse = await axios.post(
        `${conf.apiUrlPrefix}/schedules/upload`,
        formData
      );
      const imageUrl = uploadResponse.data.filePath;
      console.log("testImage", imageUrl);
      const response = await axios.post(`${conf.apiUrlPrefix}/schedules`, {
        subjectCode: selectedSubject,
        title: title,
        description: detail,
        startTime: startDate.toISOString(),
        stopTime: endDate.toISOString(),
        image: imageUrl,
        createBy: { id: value.user?.id ?? 0 },
        vote: 0,
        createdDate: new Date().toISOString(),
      });
      console.log("Posted Event:", response);
      console.log(photo);
      handlePostSuccess();
      toast.success("สร้างประกาศสำเร็จแล้ว");
      format();
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const fetchSubject = async () => {
    try {
      if (!auth || !auth.user) {
        console.error("User not authenticated");
        return;
      }

      const classSubject = await axios.get(
        `${conf.apiUrlPrefix}/api/fetch-student-class-date?eduYear=2563&eduTerm=1`,
        {
          headers: {
            token: auth.user.access_token,
          },
        }
      );
      setSubjctType(classSubject.data);
      // console.log("data = ", subject.data);
    } catch (error) {
      console.log("error Subject", error);
    }
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    console.log("file test", file);
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        if (result) {
          setPreviewPhoto(result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const format = () => {
    setTitle("");
    setDetail("");
    setStartDate(new Date());
    setEndDate(new Date());
    setPreviewPhoto("");
    setPhoto(null);
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <>
        <button
          className="btn btn-circle btn-outline hover:btn-neutral mb-5"
          onClick={() => setModalOpen(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
            />
          </svg>
        </button>
        <ListPost fetchPost={reloadPosts} subjectData={subjectType}/>
        <Toaster position="bottom-right" />
        {modalOpen && (
          <div
            className={`modal-overlay fixed flex justify-center items-center top-0 left-0 z-10 bg-black bg-opacity-50 w-full h-full`}
          >
            <div className="modal-box">
              <form method="dialog">
                <button
                  className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                  onClick={() => setModalOpen(false)}
                >
                  ✕
                </button>
              </form>
              <h3 className="font-bold text-lg bg-n text-center">
                สร้างประกาศ
              </h3>
              <p className="pt-5">
                <label className="form-control ">
                  <div className="label">
                    <span className="block text-gray-700 text-sm font-bold mb-2">
                      วิชา
                    </span>
                  </div>
                  <Select
                    value={selectedSubject}
                    onChange={(e: any) => {
                      setSelectedSubject(e.target.value);
                    }}
                  >
                    <option value="">เลือกวิชา</option>
                    {subjectType
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
                </label>
                <label className="form-control ">
                  <div className="label">
                    <span className="block text-gray-700 text-sm font-bold mb-2 mt-2">
                      ชื่อประกาศ
                    </span>
                  </div>
                  <input
                    type="text"
                    placeholder="หัวข้อเรื่อง"
                    className="input input-bordered w-full "
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </label>
                <label className="form-control w-full">
                  <div className="label">
                    <span className="block text-gray-700 text-sm font-bold mb-2 mt-2">
                      รายละเอียด
                    </span>
                  </div>
                  <textarea
                    placeholder="รายละเอียด"
                    className="textarea textarea-bordered w-full"
                    rows={4}
                    value={detail}
                    onChange={(e) => setDetail(e.target.value)}
                  />
                </label>
                <div className="flex pt-3">
                  <div className="mb-4">
                    <KeyboardDateTimePicker
                      label="วันที่และเวลาเริ่มต้น"
                      value={startDate}
                      onChange={(date) => date && setStartDate(date)}
                      format="dd/MM/yyyy HH:mm"
                    />
                  </div>
                  <div className="mb-4">
                    <KeyboardDateTimePicker
                      label="วันที่และเวลาสิ้นสุด"
                      value={endDate}
                      onChange={(date) => date && setEndDate(date)}
                      format="dd/MM/yyyy HH:mm"
                    />
                  </div>
                </div>
                <div>
                  <Label
                    htmlFor="dropzone-file"
                    className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                  >
                    <div className="flex flex-col items-center justify-center pb-6 pt-5">
                      {previewPhoto && (
                        <img
                          src={previewPhoto}
                          alt="Preview"
                          className="mb-4 h-32 w-auto"
                        />
                      )}{" "}
                      <svg
                        className={`mb-4 h-8 w-8 text-gray-500 dark:text-gray-400 ${
                          previewPhoto ? "hidden" : ""
                        }`}
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">คลิกเพื่ออัพโหลด</span>{" "}
                        หรือลากและวาง
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        SVG, PNG, JPG or GIF (MAX. 800x400px)
                      </p>
                    </div>
                    <FileInput
                      id="dropzone-file"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </Label>
                </div>
              </p>
              <Button
                gradientDuoTone="purpleToPink"
                className="px-6 mt-6 mx-auto "
                onClick={() => {
                  setModalOpen(false);
                  PostEvent();
                }}
              >
                สร้าง
              </Button>
            </div>
          </div>
        )}
      </>
    </MuiPickersUtilsProvider>
  );
}

export default PostEvent;
