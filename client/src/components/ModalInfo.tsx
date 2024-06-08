import conf from "@/conf/main";
import { ProfileAuthContext } from "@/contexts/Auth.context";
import { useSession } from "@supabase/auth-helpers-react";
import axios from "axios";
import { Button, Modal } from "flowbite-react";
import { useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";

export default function ModalInfo({
  event,
  openModal,
  onClose,
}: {
  event: any;
  openModal: boolean;
  onClose: () => void;
}) {
  const [modalOpen, setModalOpen] = useState(openModal);
  const value = useContext(ProfileAuthContext);
  const session = useSession();

  useEffect(() => {
    setModalOpen(openModal);
  }, [openModal]);

  const handleCloseModal = () => {
    setModalOpen(false);
    onClose();
  };

  const formatDateTime = (dateTime: string): string => {
    const date = new Date(dateTime);
    return date.toLocaleString("en-US");
  };

  const handleDeleteEvent = async (id: number, googleEventId: string) => {
    try {
      const deleteEventResult = await axios.delete(
        `${conf.apiUrlPrefix}/event/${id}`
      );
      console.log("deleteEventResult", deleteEventResult);

      if (value.triggerFetch) {
        value.triggerFetch();
      }
      toast.success("ลบกิจกรรมสำเร็จแล้ว!!");

      handleCloseModal();
      if (value.user?.google && googleEventId) {
        const responseDelete = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/primary/events/${googleEventId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: "Bearer " + session?.provider_token,
            },
          }
        );

        if (responseDelete.ok) {
          console.log(`Successfully deleted event with ID: ${googleEventId}`);
        } else {
          console.error(
            `Failed to delete event with ID: ${googleEventId}`,
            responseDelete.statusText
          );
        }
      }
    } catch (error) {
      console.error("error", error);
    }
  };

  if (!event) {
    return null;
  }
  // console.log("modal event", event);

  const handleDelete = async (id: number) => {
    try {
      const resDelete = await axios.delete(
        `${conf.apiUrlPrefix}/schedules/${id}`
      );
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
      handleCloseModal();
    } catch (error) {
      console.error("Error update vote:", error);
      toast.error("เกิดข้อผิดพลาดในการโหวต");
    }
  };

  return (
    <Modal
      show={modalOpen}
      onClose={handleCloseModal}
      className="animate-modal"
    >
      <Modal.Header
        className={`
  ${
    !event._def.extendedProps.examTypeDesc && event._def.extendedProps.allday
      ? "bg-[#FFC7C7]"
      : ""
  }
  ${event._def.extendedProps.examTypeDesc ? "bg-warning" : ""}
  ${
    event._def.extendedProps.lecturer && !event._def.extendedProps.examTypeDesc
      ? "bg-info"
      : ""
  }
  text-sm text-white p-5
`}
      >
        {event.title}{" "}
        {event._def.extendedProps.vote >= 5 ? (
          <div className="badge bg-[#C3FF93] ml-1">ยืนยันแล้ว</div>
        ) : event._def.extendedProps.vote < 5 ? (
          <div className="badge badge-ghost ml-1">ยังไม่ยืนยัน</div>
        ) : null}
      </Modal.Header>
      <Modal.Body className="animate-opacity bg-base-100 rounded-xl shadow-sm">
        <div className="space-y-6 py-3">
          {event._def.extendedProps.examTypeDesc && (
            <>
              <p className="text-base leading-relaxed text-gray-500 font-thin dark:text-gray-400">
                <span className="font-bold">ประเภทการสอบ: </span>
                {event._def.extendedProps.examTypeDesc} <br />
                <span className="font-bold">ประเภทวันสอบ: </span>{" "}
                {event._def.extendedProps.examdateTypeDesc} <br />
                <span className="font-bold">วันและเวลา: </span>{" "}
                {formatDateTime(event.start)} - {formatDateTime(event.end)}
                <br />
                <span className="font-bold">จำนวนผู้เข้าสอบ: </span>{" "}
                {event._def.extendedProps.noExaminee} <br />
                <span className="font-bold">อาคารสอบ: </span>{" "}
                {event._def.extendedProps.buildingName} <br />
                <span className="font-bold">ห้องสอบ: </span>
                {event._def.extendedProps.description} <br />
              </p>
            </>
          )}
          {!event._def.extendedProps.examTypeDesc &&
            event._def.extendedProps.allday &&
            !event._def.extendedProps.image && (
              <>
                <p className="text-base leading-relaxed text-gray-500 font-thin dark:text-gray-400">
                  <span className="font-bold">รายละเอียด: </span>
                  {event._def.extendedProps.description} <br />
                  <span className="font-bold">เริ่มวันที่: </span>
                  {formatDateTime(event.start)} <br />
                  <span className="font-bold">สิ้นสุดวันที่: </span>{" "}
                  {formatDateTime(event.end)}
                </p>
              </>
            )}
          {event._def.extendedProps.lecturer &&
            !event._def.extendedProps.examTypeDesc && (
              <>
                <p className="text-base leading-relaxed text-gray-500 font-thin dark:text-gray-400">
                  <span className="font-bold">เรียนที่: </span>
                  {event._def.extendedProps.description} <br />
                  <span className="font-bold">เวลา: </span>{" "}
                  {formatDateTime(event.start)} - {formatDateTime(event.end)}
                  <br />
                  <span className="font-bold">ตอนที่: </span>{" "}
                  {event._def.extendedProps.section} <br />
                  <span className="font-bold">อาจารย์: </span>{" "}
                  {event._def.extendedProps.lecturer}
                </p>
              </>
            )}

          {!event._def.extendedProps.lecturer &&
            !event._def.extendedProps.examTypeDesc &&
            !event._def.extendedProps.subjectCode &&
            !event._def.extendedProps.vote && (
              <>
                <p className="text-base leading-relaxed text-gray-500 font-thin dark:text-gray-400">
                  <span className="font-bold">รายละเอียด: </span>
                  {event._def.extendedProps.description} <br />
                  <span className="font-bold">เวลา: </span>{" "}
                  {formatDateTime(event.start)} - {formatDateTime(event.end)}
                  <br />
                </p>
              </>
            )}

          {event._def.extendedProps.image && (
            <>
              <div className="card card-compact w-96 bg-base-100 shadow-xl my-10 mx-auto">
                <div className="flex justify-center items-center mt-3">
                  {new Date(
                    event._def.extendedProps.createdDate
                  ).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                <figure>
                  {event._def.extendedProps.image ? (
                    <img
                      src={event._def.extendedProps.image}
                      alt="Post Image"
                      className="h-[240px] mt-3"
                    />
                  ) : (
                    <p className="text-center text-gray-500">ไม่มีรูปภาพ</p>
                  )}
                </figure>
                <div className="card-body">
                  <h2 className="card-title text-base">
                    {event.title}{" "}
                    <div className="badge badge-accent">
                      {event._def.extendedProps.subjectCode}
                    </div>
                  </h2>
                  <p>{event._def.extendedProps.description}</p>
                  <p>
                    <strong>เริ่มต้นเมื่อ:</strong>{" "}
                    {new Date(event.start).toLocaleString()}
                  </p>
                  <p>
                    <strong>สิ้นสุดเมื่อ:</strong>{" "}
                    {new Date(event.end).toLocaleString()}
                  </p>
                  <p>
                    <strong>ผู้โพสต์:</strong>{" "}
                    {event._def.extendedProps.createBy}
                  </p>
                  <p>
                    <strong>
                      ยืนยันแล้ว: {event._def.extendedProps.vote} คน
                    </strong>{" "}
                  </p>
                  <div className="card-actions justify-end mt-2">
                    {value.user?.studentId ===
                      event._def.extendedProps.createBy && (
                      <button
                        className="btn btn-secondary"
                        onClick={() =>
                          handleDelete(event._def.extendedProps.id)
                        }
                      >
                        ลบประกาศ
                      </button>
                    )}
                    <button
                      className="btn btn-info"
                      onClick={() => {
                        const isVotedByCurrentUser =
                          event._def.extendedProps.votedBy &&
                          event._def.extendedProps.votedBy.studentId ===
                            value.user?.studentId;
                        if (!isVotedByCurrentUser) {
                          VoteUpdate(
                            event._def.extendedProps.id,
                            event._def.extendedProps.vote
                          );
                        }
                      }}
                      disabled
                    >
                      ยืนยัน/รับทราบ
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </Modal.Body>
      {!event._def.extendedProps.lecturer &&
        !event._def.extendedProps.examTypeDesc &&
        !event._def.extendedProps.subjectCode &&
        !event._def.extendedProps.vote && (
          <Modal.Footer className="justify-end my-auto p-3 bg-base-100">
            <Button
              size={"sm"}
              color="red"
              onClick={() =>
                handleDeleteEvent(
                  event._def.publicId,
                  event._def.extendedProps.eventIdGoogle
                )
              }
            >
              ลบกิจกรรม
            </Button>
            <Button color="gray" onClick={handleCloseModal} size={"sm"}>
              ยกเลิก
            </Button>
          </Modal.Footer>
        )}
    </Modal>
  );
}
