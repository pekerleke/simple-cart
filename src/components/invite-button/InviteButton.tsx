import useModal from '@/hooks/useModal';
import React, { useState } from 'react'
import QRCode from 'react-qr-code';
import { Button } from 'rsuite';
import { toast } from 'react-toastify';
import { LuUserPlus } from 'react-icons/lu';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import styles from "./inviteButton.module.scss";

interface Props {
    organizationId: string;
    disabled: boolean;
}

export const InviteButton = (props: Props) => {
    const { organizationId, disabled } = props;

    const [isLoading, setIsLoading] = useState(false);

    const { Modal, setModal } = useModal();

    const {t: translate} = useTranslation();

    const handleCopyLink = (text: string) => {
        navigator.clipboard.writeText(text)
        toast.success(translate("copied"));
    }

    const handleInvite = async () => {
        setIsLoading(true);
        await fetch(`/api/organizations/invite`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ organization_id: organizationId }),
        })
            .then((res) => res.json())
            .then((resData) => {
                const invitationUrl = `${location.origin}/invitation?invitationCode=${resData.data.code}`;
                setModal((
                    <>
                        <div className={styles.invitationContainer}>
                            <QRCode
                                size={256}
                                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                value={invitationUrl}
                                viewBox={`0 0 256 256`}
                            />

                            <br /><br />

                            <Button block onClick={() => handleCopyLink(invitationUrl)}>
                                <b>{translate("copyLink")}</b>
                            </Button>
                        </div>
                        <hr />
                        <center><small>{translate("invitationExpireTime")}</small></center>
                    </>
                ), translate("invitation"))
            })
            .finally(() => setIsLoading(false));
    }

    return (
        <>
            <Button block onClick={handleInvite} loading={isLoading} disabled={isLoading || disabled}>
                <div className={classNames(styles.buttonText, {[styles.disabled]: disabled})}><LuUserPlus /> {translate("inviteParticipant")}</div>
            </Button>
            <Modal />
        </>
    )
}
