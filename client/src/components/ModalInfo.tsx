import conf from "@/conf/main";
import { ProfileAuthContext } from "@/contexts/Auth.context";
import axios from "axios";
import { Button, Modal } from "flowbite-react";
import { useState, useEffect, useContext } from "react";

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

  const handleDeleteEvent = async (id: number) => {
    try {
      const deleteEventResult = await axios.delete(
        `${conf.apiUrlPrefix}/event/${id}`
      );
      console.log("deleteEventResult", deleteEventResult);
      if (value.triggerFetch) {
        value.triggerFetch();
      }
      handleCloseModal();
    } catch (error) {
      console.error("error", error);
    }
  };

  if (!event) {
    return null;
  }
  // console.log("modal event", event);

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
        {event.title}
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
            event._def.extendedProps.allday && (
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
            !event._def.extendedProps.subjectCode && (
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
        </div>
      </Modal.Body>
      {!event._def.extendedProps.lecturer &&
        !event._def.extendedProps.examTypeDesc &&
        !event._def.extendedProps.subjectCode && (
          <Modal.Footer className="justify-end my-auto p-3 bg-base-100">
            <Button
              size={"sm"}
              color="red"
              onClick={() => handleDeleteEvent(event._def.publicId)}
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
