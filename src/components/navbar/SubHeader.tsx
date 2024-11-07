import React, { useState } from 'react'

import styles from "./SubHeader.module.scss";

interface Props {
    text: string;
}

export const SubHeader = (props: Props) => {
    const { text } = props;

    const [show, setShow] = useState(true);

    if (!show) return null;

    return (
        <div className={styles.subHeader}>
            <div>{text}</div>
            <div onClick={() => setShow(false)}>✕</div>
        </div>
    )
}
