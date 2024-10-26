import React from 'react'

import styles from "./message.module.scss";
import classNames from 'classnames';

interface Props {
    message?: string;
    type: "info" | "warning" | "error" | "success";
    children?: JSX.Element | JSX.Element[],
    center?: boolean
}

export const Message = (props: Props) => {
    const {message, type, children, center} = props;

    return (
        <div className={classNames(styles.container, styles[type], {[styles.centered]: center})}>
            {children || message}
        </div>
    )
}
