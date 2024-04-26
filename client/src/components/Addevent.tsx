import React, { useState } from "react";
import { FileInput, Label } from "flowbite-react";
import { KeyboardDateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns'; // Use the date management library you prefer

function Addevent() {
  const [modalOpen, setModalOpen] = useState(false);
  const [startDate, setStartDate] = useState<any>(null);
  const [endDate, setEndDate] = useState<any>(null);

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <>
        <button
          className="btn btn-circle btn-outline hover:btn-neutral"
          onClick={() => setModalOpen(true)}
        >
          POST
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
                    <span className="block text-gray-700 text-sm font-bold mb-2">แจ้งเหตุ ?</span>
                  </div>
                  <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
                </label>
                <label className="form-control w-full max-w-xs pb-">
                  <div className="label">
                    <span className="block text-gray-700 text-sm font-bold mb-2">รายละเอียด ?</span>
                  </div>
                  <textarea
                    placeholder="Type here"
                    className="textarea textarea-bordered w-full"
                    rows={4}
                  />
                </label>
                <div className="flex pt-3">
                   <div className="mb-4">
                  <KeyboardDateTimePicker
                    label="Start Date and Time"
                    value={startDate}
                    onChange={(date) => setStartDate(date)}
                    format="dd/MM/yyyy HH:mm"
                  />
                </div>
                <div className="mb-4">
                  <KeyboardDateTimePicker
                    label="End Date and Time"
                    value={endDate}
                    onChange={(date) => setEndDate(date)}
                    format="yyyy/MM/dd HH:mm"
                  />
                </div>
                </div>
               
                <div>
                  <Label
                    htmlFor="dropzone-file"
                    className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                  >
                    <div className="flex flex-col items-center justify-center pb-6 pt-5">
                      <svg
                        className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
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
                        <span className="font-semibold">Click to upload</span> or
                        drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        SVG, PNG, JPG or GIF (MAX. 800x400px)
                      </p>
                    </div>
                    <FileInput id="dropzone-file" className="hidden" />
                  </Label>
                </div>
              </p>
            </div>
          </div>
        )}
      </>
    </MuiPickersUtilsProvider>
  );
}

export default Addevent;
