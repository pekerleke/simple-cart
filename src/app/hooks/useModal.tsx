import { GenericModal } from "@/components/generic-modal/GenericModal";
import { useState } from "react"

const useModal = () => {

    const [children, setChildren] = useState<JSX.Element | JSX.Element[]>();
    const [isModalOpen, setIsModalOpen] = useState<boolean>();

    const setModal = (children: JSX.Element | JSX.Element[]) => {
        setChildren(children);
        showModal();
    }

    const showModal = () => {
        setIsModalOpen(true);
    }

    const hideModal = () => {
        setIsModalOpen(false);
    }

    const Modal = (props: any) => {
        if (!isModalOpen) return null;

        return (
            <GenericModal onClose={hideModal} {...props}>
                {children}
            </GenericModal>
        )
    }

    return {Modal, setModal, showModal, hideModal }
}

export default useModal;