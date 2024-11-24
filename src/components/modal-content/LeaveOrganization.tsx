import React, { useState } from 'react'
import { Button, Message } from 'rsuite';
import { toast } from 'react-toastify';
import { isDemo } from '@/utils/demo';
import { useSession } from 'next-auth/react';
import { Trans, useTranslation } from 'react-i18next';

import styles from "./leaveOrganization.module.scss";

interface Props {
    onSuccess: () => void
    onCancel: () => void
    organization: any
}

export const LeaveOrganization = (props: Props) => {
    const { organization, onSuccess, onCancel } = props;

    const { data: session } = useSession();

    const [isLoading, setIsLoading] = useState(false);

    const { t: translate } = useTranslation();

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
        toast.success(translate("leaveSuccess"));
        onSuccess();
    }

    return (
        <div>
            <Message type="warning">
                <Trans
                    i18nKey="leaveOrganization.advice"
                    components={{
                        strong: <strong />
                    }}
                    values={{ name: organization.name }}
                />
            </Message>
            <br />
            <div className={styles.buttonContainer}>
                <Button onClick={onCancel} disabled={isLoading}>{translate("cancel")}</Button>
                <Button color='red' appearance='primary' onClick={handleDelete} disabled={isLoading} loading={isLoading}>{translate("leaveConfirmation")}</Button>
            </div>
        </div>
    )
}
