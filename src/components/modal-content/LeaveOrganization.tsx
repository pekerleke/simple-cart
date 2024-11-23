import React, { useState } from 'react'
import { Button, Message } from 'rsuite';
import { toast } from 'react-toastify';
import { isDemo } from '@/utils/demo';

import styles from "./leaveOrganization.module.scss";
import { useSession } from 'next-auth/react';

interface Props {
    onSuccess: () => void
    onCancel: () => void
    organization: any
}

export const LeaveOrganization = (props: Props) => {
    const { organization, onSuccess, onCancel } = props;

    const { data: session } = useSession();

    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = async () => {
        if (isDemo()) {
            const demoOrganizations = JSON.parse(localStorage.getItem("demoOrganizations") || "[]");
            const remainingOrganizations = demoOrganizations.filter((demoOrganization: any) => demoOrganization.id !== organization.id);
            localStorage.setItem("demoOrganizations", JSON.stringify(remainingOrganizations));
        } else {
            setIsLoading(true);
            const userParticipation = organization.organization_participants.find((participant: any) => participant.user_id === (session?.user as any)?.id);
            await fetch('/api/participants', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: userParticipation.id }),
            }).finally(() => setIsLoading(false));
        }
        toast.success("You just left the organization!");
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
