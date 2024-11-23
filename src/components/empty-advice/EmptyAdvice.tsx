import React from 'react'
import { TbMoodEmpty } from 'react-icons/tb'

import styles from "./emptyAdvice.module.scss";
import { MdOutlineLightbulb } from 'react-icons/md';

interface Props {
    title: string;
    children: JSX.Element | JSX.Element[]
}

export const EmptyAdvice = (props: Props) => {
    const {title, children} = props;

    return (
        <div className={styles.container}>
            <div className={styles.icon}><MdOutlineLightbulb /></div>
            <h3>{title}</h3>
            <div className={styles.subText}>{children}</div>
        </div>
    )
}
