import React, { useState } from 'react'
import { Button, Message } from 'rsuite';
import { toast } from 'react-toastify';
import { isDemo } from '@/utils/demo';
import { Trans, useTranslation } from 'react-i18next';

import styles from "./deleteOrganization.module.scss";

interface Props {
    onSuccess: () => void
    onCancel: () => void
    organization: any
}

export const DeleteOrganization = (props: Props) => {
    const { organization, onSuccess, onCancel } = props;

    const [isLoading, setIsLoading] = useState(false);

    const { t: translate } = useTranslation();

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
                <Trans
                    i18nKey="removeOrganization.advice"
                    components={{
                        strong: <strong />
                    }}
                    values={{ name: organization.name }}
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
