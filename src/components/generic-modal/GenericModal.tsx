import React from 'react'

import styles from "./genericModal.module.scss";

interface Props {
    title?: string
    children: JSX.Element | JSX.Element[] | undefined
    onClose: () => void
}

export const GenericModal = (props: Props) => {
    const { title, children, onClose } = props;

    return (
        <div className={styles.container}>
            <div className={styles.modal}>
                <div className={styles.modalTitle}>
                    {title || "title"}
                    <div className={styles.closeButton} onClick={onClose}>✕</div>
                </div>
                <div className={styles.modalBody}>
                    {children}
                </div>
            </div>
        </div>
    )
}
