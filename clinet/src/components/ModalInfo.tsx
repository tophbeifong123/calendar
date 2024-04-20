import { Button, Modal } from "flowbite-react";
import { useState, useEffect } from "react";

export default function ModalInfo({ openModal, onClose }: { openModal: boolean, onClose: () => void }) {
  const [modalOpen, setModalOpen] = useState(openModal);

  useEffect(() => {
    setModalOpen(openModal);
  }, [openModal]);

  const handleCloseModal = () => {
    setModalOpen(false);

  };

  return (
    <Modal show={modalOpen} onClose={handleCloseModal}>
      <Modal.Header>Event Details</Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
            testtest
          </p>
        </div>
      </Modal.Body>
    </Modal>
  );
}
