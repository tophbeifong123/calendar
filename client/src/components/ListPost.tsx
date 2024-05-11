import React, { useState, useEffect } from "react";
import { Button, FileInput, Label } from "flowbite-react";
import {
  KeyboardDateTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import axios from "axios";
import conf from "@/conf/main";
import { useAuth } from "react-oidc-context";

function ListPost() {
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
    } else {
      console.log("No access token available");
    }
  }, [auth]);

  return (
    <>
      <button
        className="btn btn-circle btn-outline hover:btn-neutral mt-5"
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
            d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
          />
        </svg>
      </button>
      {modalOpen && (
        <div
          className={`modal-overlay fixed flex justify-center items-center top-0 left-0 z-10 bg-black bg-opacity-50 w-full h-full`}
        >
          <div className="modal-box">
            <Button
              gradientDuoTone="pinkToOrange"
              className="px-6 mt-6 mx-auto "
              onClick={() => {
                setModalOpen(false);
              }}
            >
              สร้าง
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export default ListPost;
