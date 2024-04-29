import { GenericModal } from "@/components/generic-modal/GenericModal";
import { useState } from "react"

const useModal = () => {

    const [children, setChildren] = useState<JSX.Element | JSX.Element[]>();
    const [isModalOpen, setIsModalOpen] = useState<boolean>();
    const [title, setTitle] = useState<string>();

    const setModal = (children: JSX.Element | JSX.Element[], title?: string) => {
        setChildren(children);
        setTitle(title);
        showModal();
    }

    const showModal = () => {
        setIsModalOpen(true);
    }

    const hideModal = () => {
        setIsModalOpen(false);
    }

    const Modal = () => {
        if (!isModalOpen) return null;

        return (
            <GenericModal onClose={hideModal} title={title}>
                {children}
            </GenericModal>
        )
    }

    return { Modal, setModal, showModal, hideModal }
}

export default useModal;