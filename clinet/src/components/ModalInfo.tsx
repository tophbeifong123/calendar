"use client";

import { Button, Modal } from "flowbite-react";
import { useState, useEffect } from "react";

export default function ModalInfo({ event, openModal, onClose }: { event:any, openModal: boolean, onClose: () => void }) {
  const [modalOpen, setModalOpen] = useState(openModal);

  useEffect(() => {
    setModalOpen(openModal);
    console.log("selectEvent",event)
  }, [openModal]);

  const handleCloseModal = () => {
    setModalOpen(false);
    onClose();
  };

  return (
    <Modal show={modalOpen} onClose={handleCloseModal}>
      <Modal.Header>{event.title}</Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
            {event._def.extendedProps.description}
            {event._def.extendedProps.description}
          </p>
        </div>
      </Modal.Body>
     
    </Modal>
  );
}