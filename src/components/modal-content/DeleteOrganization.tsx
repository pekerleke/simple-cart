import React, { useState } from 'react'
import { Button, Message } from 'rsuite';
import { toast } from 'react-toastify';
import { isDemo } from '@/utils/demo';

import styles from "./deleteOrganization.module.scss";

interface Props {
    onSuccess: () => void
    onCancel: () => void
    organization: any
}

export const DeleteOrganization = (props: Props) => {
    const { organization, onSuccess, onCancel } = props;

    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = async () => {

        if (isDemo()) {
            const demoOrganizations = JSON.parse(localStorage.getItem("demoOrganizations") || "[]");
            const remainingOrganizations = demoOrganizations.filter((demoOrganization: any) => demoOrganization.id !== organization.id);
            localStorage.setItem("demoOrganizations", JSON.stringify(remainingOrganizations));
        } else {
            setIsLoading(true);
            await fetch('/api/organizations', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: organization.id }),
            }).finally(() => setIsLoading(false));
        }
        toast.success("Removed!");
        onSuccess();
    }

    return (
        <div>
            <Message type="warning">
                Are you sure to delete <strong>{organization.name}</strong>? <br /><br />This cannot be undone
            </Message>
            <br />
            <div className={styles.buttonContainer}>
                <Button onClick={onCancel} disabled={isLoading}>Cancel</Button>
                <Button color='red' appearance='primary' onClick={handleDelete} disabled={isLoading} loading={isLoading}>Yes, delete forever</Button>
            </div>
        </div>
    )
}
