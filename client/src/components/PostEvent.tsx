import React, { useState, useEffect } from "react";
import { FileInput, Label } from "flowbite-react";
import {
  KeyboardDateTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import axios from "axios";
import conf from "@/conf/main";
import { useAuth } from "react-oidc-context";

function PostEvent() {
  const auth = useAuth();
  const [modalOpen, setModalOpen] = useState<Boolean>(false);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [subjectType, setSubjctType] = useState<any>({});
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [detail, setDetail] = useState<string>("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<string>("");

  useEffect(() => {
    if (auth.isAuthenticated) {
      fetchSubject();
    } else {
      console.log("No access token available");
    }
  }, [auth]);

  const addEvent = async () => {
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
        subjectType: selectedSubject,
        title: title,
        description: detail,
        startTime: startDate.toISOString(),
        stopTime: endDate.toISOString(),
        image: imageUrl,
      });
      console.log("Posted Event:", response);
      console.log(photo);
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

      const subject = await axios.get(
        `${conf.apiUrlPrefix}/api/fetch-student-class-date?eduYear=2563&eduTerm=1`,
        {
          headers: {
            token: auth.user.access_token,
          },
        }
      );
      setSubjctType(subject.data);
      console.log("data = ", subject.data);
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

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <>
        <button
          className="btn btn-circle btn-outline hover:btn-neutral"
          onClick={() => setModalOpen(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z"
            />
          </svg>
        </button>
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
              <h3 className="font-bold text-lg bg-n">สร้างประกาศ</h3>
              <p className="pt-5">
                <label className="form-control ">
                  <div className="label">
                    <span className="block text-gray-700 text-sm font-bold mb-2">
                      วิชา
                    </span>
                  </div>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                  >
                    <option value="">เลื่อกวิชา</option>
                    {Object.values(subjectType).map((subject: any) => (
                      <option key={subject.subjectId} value={subject.subjectId}>
                        {subject.subjectNameThai}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="form-control ">
                  <div className="label">
                    <span className="block text-gray-700 text-sm font-bold mb-2">
                      Event title
                    </span>
                  </div>
                  <input
                    type="text"
                    placeholder="หัวข้อเรื่อง"
                    className="input input-bordered w-full max-w-xs"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </label>
                <label className="form-control w-full max-w-xs pb-">
                  <div className="label">
                    <span className="block text-gray-700 text-sm font-bold mb-2">
                      Details
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
                      label="Start Date and Time"
                      value={startDate}
                      onChange={(date) => date && setStartDate(date)}
                      format="dd/MM/yyyy HH:mm"
                    />
                  </div>
                  <div className="mb-4">
                    <KeyboardDateTimePicker
                      label="End Date and Time"
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
                      {/* Display preview image */}
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
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        SVG, PNG, JPG or GIF (MAX. 800x400px)
                      </p>
                    </div>
                    {/* Input for uploading photo */}
                    <FileInput
                      id="dropzone-file"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </Label>
                </div>
              </p>
            </div>
            <button
              type="button"
              className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              onClick={() => {
                setModalOpen(false);
                addEvent();
              }}
            >
              Save
            </button>
          </div>
        )}
      </>
    </MuiPickersUtilsProvider>
  );
}

export default PostEvent;
