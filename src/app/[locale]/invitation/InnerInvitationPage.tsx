"use client"

import Loader from "@/components/loader/Loader";
import { useSearchParams } from "next/navigation";
import { useRouter } from 'next/navigation';
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { stringToColor } from "@/utils/stringToColor";
import { Button } from "rsuite";
import { Message } from "@/components/message/Message";
import { Suspense, useState } from "react";

import styles from "./styles.module.scss";

export const InnerInvitationPage = () => {

    const [isLoading, setIsLoading] = useState(false);

    const searchParams = useSearchParams();
    const invitationCode = searchParams.get('invitationCode');

    const router = useRouter();

    const handleAccept = () => {
        setIsLoading(true);
        fetch(`/api/organizations/accept-invite`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ invitationCode })
        })
            .then(res => res.json())
            .then(resData => {
                router.push(`/organization/${resData.data.organizationId}`)
            })
            .catch(err => { console.error(err); toast.error("Ups something went wrong!") })
            .finally(() => setIsLoading(false));
    }

    const { data, status } = useQuery({
        queryKey: [`invitation-${invitationCode}`],
        queryFn: () => fetch(`/api/organizations/invite?invitationCode=${invitationCode}`)
            .then(res => res.json())
            .then(data => data.data)
            .catch(err => console.error(err)),
    })

    const avatarColors = stringToColor(data?.organizations.name || "");

    if (!data && status === "loading") {
        return (
            <div className={styles.container}>
                <Loader />
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.organizationContainer}>
                <div className={styles.avatar} style={{ backgroundColor: avatarColors.pastel, color: avatarColors.contrast }}>
                    {data?.organizations.name[0]}
                </div>
                <h3>{data?.organizations.name}</h3>
            </div>

            <div className={styles.buttonContainer}>
                {
                    new Date(data?.expires_at).getTime() < new Date().getTime() ? (
                        <Message center message="Invitation expired" type="error" />
                    ) : (
                        <Button appearance="primary" size="lg" block disabled={isLoading} loading={isLoading} onClick={handleAccept}>
                            <b>Accept invitation</b>
                        </Button>
                    )
                }

                <Button block onClick={() => router.push("/")}>
                    Back to Home
                </Button>
            </div>
        </div>
    )
}