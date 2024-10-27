import React, { useContext, useState } from 'react'
import { Button, Message } from 'rsuite';
import { toast } from 'react-toastify';
import { AuthContext } from '@/providers/AuthProvider';

import styles from "./leaveOrganization.module.scss";

interface Props {
    onSuccess: () => void
    onCancel: () => void
    organization: any
}

export const LeaveOrganization = (props: Props) => {
    const { organization, onSuccess, onCancel } = props;

    const { user } = useContext(AuthContext);

    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = async () => {
        setIsLoading(true);
        const userParticipation = organization.organization_participants.find((participant: any) => participant.user_id === (user as any)?.id);
        await fetch('/api/participants', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: userParticipation.id }),
        }).finally(() => setIsLoading(false));
        toast.success("Removed!");
        onSuccess();
    }

    return (
        <div>
            <Message type="warning">
                Are you sure to leave <strong>{organization.name}</strong>?
            </Message>
            <br />
            <div className={styles.buttonContainer}>
                <Button onClick={onCancel} disabled={isLoading}>Cancel</Button>
                <Button color='red' appearance='primary' onClick={handleDelete} disabled={isLoading} loading={isLoading}>Yes, leave</Button>
            </div>
        </div>
    )
}
