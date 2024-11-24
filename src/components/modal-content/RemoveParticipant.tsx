import React, { useState } from 'react'
import { Button, Message } from 'rsuite';
import { toast } from 'react-toastify';
import { Trans, useTranslation } from 'react-i18next';

import styles from "./removeParticipant.module.scss";

interface Props {
    onDelete: () => void
    onCancel: () => void
    participant: any
}

export const RemoveParticipant = (props: Props) => {
    const { participant, onDelete, onCancel } = props;

    const [isLoading, setIsLoading] = useState(false);

    const { t: translate } = useTranslation();

    const handleDelete = async () => {
        setIsLoading(true);
        await fetch('/api/participants', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: participant.id }),
        })
            .then((res) => { if (res.status === 200) { toast.success("Removed!") } else throw new Error("Something went wrong") })
            .catch(() => toast.error(translate("error.generic")))
            .finally(() => setIsLoading(false));
        onDelete();
    }

    return (
        <div>
            <Message type="warning">
                <Trans
                    i18nKey="removeParticipant.advice"
                    components={{
                        strong: <strong />
                    }}
                    values={{ name: participant.users.full_name }}
                />
            </Message>
            <br />
            <div className={styles.buttonContainer}>
                <Button onClick={onCancel} disabled={isLoading}>{translate("cancel")}</Button>
                <Button color='red' appearance='primary' onClick={handleDelete} disabled={isLoading} loading={isLoading}>{translate("removeConfirmation")}</Button>
            </div>
        </div>
    )
}
