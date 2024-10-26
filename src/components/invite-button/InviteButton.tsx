import useModal from '@/app/hooks/useModal';
import React, { useState } from 'react'
import QRCode from 'react-qr-code';
import { Button } from 'rsuite';

import styles from "./inviteButton.module.scss";
import { toast } from 'react-toastify';

interface Props {
    organizationId: string;
}

export const InviteButton = (props: Props) => {
    const { organizationId } = props;

    const [isLoading, setIsLoading] = useState(false);

    const { Modal, setModal } = useModal();

    const handleCopyLink = (text: string) => {
        const element = document.createElement('textarea');
        element.value = text;
        document.body.appendChild(element);
        element.select();
        document.execCommand('copy');
        document.body.removeChild(element);
        toast.success("Copied!");
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
                const invitationUrl = `${window.location.host}/invitation?invitationCode=${resData.data.code}`;
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
                                <b>Copy link</b>
                            </Button>
                        </div>
                        <hr />
                        <center><small>Initation link expires in 24hs</small></center>
                    </>
                ), "Invitation")
            })
            .finally(() => setIsLoading(false));
    }

    return (
        <>
            <Button block onClick={handleInvite} loading={isLoading} disabled={isLoading}>
                <b>Invite participant</b>
            </Button>
            <Modal />
        </>
    )
}
