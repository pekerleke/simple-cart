import useModal from '@/app/hooks/useModal';
import React, { useState } from 'react'
import QRCode from 'react-qr-code';
import { Button } from 'rsuite';

interface Props {
    organizationId: string;
}

export const InviteButton = (props: Props) => {
    const { organizationId } = props;

    const [isLoading, setIsLoading] = useState(false);

    const { Modal, setModal } = useModal();

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
                    <div>
                        <div style={{ height: "auto", margin: "0 auto", maxWidth: 150, width: "100%" }}>
                            <QRCode
                                size={256}
                                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                value={invitationUrl}
                                viewBox={`0 0 256 256`}
                            />
                        </div>

                        <Button block onClick={() => alert(invitationUrl)}>
                            <b>Copy link</b>
                        </Button>
                        <hr />
                        {/* Expires at: {dayjs(resData.data.expires_at).format("DD-MM-YYYY hh:mm")} */}
                        <center><small>*Expires in 24hs</small></center>
                    </div>
                ), "Invitation")
            })
            .finally(() => setIsLoading(false));
    }

    return (
        <div>
            <Button block onClick={handleInvite} loading={isLoading} disabled={isLoading}>
                <b>Invite participant</b>
            </Button>
            <Modal />
        </div>
    )
}
