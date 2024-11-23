import React from 'react';
import { useClickOutside } from '@/hooks/useClickOutside';

import styles from "./genericModal.module.scss";

interface Props {
    title?: string
    children: JSX.Element | JSX.Element[] | undefined
    onClose: () => void
}

export const GenericModal = (props: Props) => {
    const { title, children, onClose } = props;

    const { ref } = useClickOutside(onClose);

    return (
        <div className={styles.container}>
            <div ref={ref} className={styles.modal}>
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
