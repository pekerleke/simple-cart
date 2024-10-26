import React from 'react'

import styles from "./message.module.scss";
import classNames from 'classnames';

interface Props {
    message: string;
    type: "info" | "warning" | "error" | "success";
}

export const Message = (props: Props) => {
    const {message, type} = props;

    return (
        <div className={classNames(styles.container, styles[type])}>
            {message}
        </div>
    )
}
