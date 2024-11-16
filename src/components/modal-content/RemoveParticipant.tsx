import React, { useState } from 'react'
import { Button, Message } from 'rsuite';
import { toast } from 'react-toastify';

import styles from "./removeParticipant.module.scss";

interface Props {
    onDelete: () => void
    onCancel: () => void
    participant: any
}

export const RemoveParticipant = (props: Props) => {
    const { participant, onDelete, onCancel } = props;

    const [isLoading, setIsLoading] = useState(false);

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
            .catch(() => toast.error("Something went wrong"))
            .finally(() => setIsLoading(false));
        onDelete();
    }

    return (
        <div>
            <Message type="warning">
                Are you sure to remove <strong>{participant.users_duplicate.full_name}</strong> from the organization?
            </Message>
            <br />
            <div className={styles.buttonContainer}>
                <Button onClick={onCancel} disabled={isLoading}>Cancel</Button>
                <Button color='red' appearance='primary' onClick={handleDelete} disabled={isLoading} loading={isLoading}>Yes, Remove</Button>
            </div>
        </div>
    )
}
