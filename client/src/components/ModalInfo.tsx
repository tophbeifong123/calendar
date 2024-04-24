import { Button, Modal } from "flowbite-react";
import { useState, useEffect } from "react";

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

  useEffect(() => {
    setModalOpen(openModal);
    console.log("selectEvent", event);
  }, [openModal]);

  const handleCloseModal = () => {
    setModalOpen(false);
    onClose();
  };

  const formatDateTime = (dateTime: string): string => {
    const date = new Date(dateTime);
    return date.toLocaleString("en-US");
  };

  if (!event) {
    return null;
  }
  console.log("event", event);

  return (
    <Modal
      show={modalOpen}
      onClose={handleCloseModal}
      className="animate-modal"
    >
      <Modal.Header className="bg-blue-200 text-sm text-white p-5">
        {event.title}
      </Modal.Header>
      <Modal.Body className="animate-opacity">
        <div className="space-y-6">
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
        </div>
      </Modal.Body>
    </Modal>
  );
}
