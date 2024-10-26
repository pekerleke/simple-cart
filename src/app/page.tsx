"use client"

import { Button } from "rsuite";
import useModal from "./hooks/useModal";
import { CreateOrEditOrganization } from "@/components/modal-content/CreateOrEditOrganization";
import { useEffect, useState } from "react";
import Link from "next/link";

import styles from "./styles.module.scss";
import { stringToColor } from "@/utils/stringToColor";
import Loader from "@/components/loader/Loader";

export default function Home() {

    const { Modal, setModal, hideModal } = useModal();

    const [isLoading, setIsLoading] = useState(true);

    const [organizations, setOrganizations] = useState([]);

    const getOrganizations = async () => {
        const response = await fetch(`/api/organizations`);
        const { data, error } = await response.json();

        setOrganizations(data);
        setIsLoading(false);
    }

    useEffect(() => {
        getOrganizations();
    }, [])

    return (
        <main style={{ padding: 10, maxWidth: 1024, margin: "auto" }}>

            {
                isLoading ? <Loader /> : (
                    <>
                        <div className={styles.organizationsContainer}>
                            {
                                organizations?.map((organization: any) => {
                                    const avatarColors = stringToColor((organization as any)?.name || "");

                                    return (
                                        <Link className={styles.link} key={organization.id} href={`/${organization.id}`}>
                                            <div className={styles.organizationAvatar} style={{ backgroundColor: avatarColors.pastel, color: avatarColors.contrast }}>
                                                {(organization as any)?.name[0]}
                                            </div>
                                            <h3>{organization.name}</h3>
                                        </Link>
                                    )
                                })
                            }
                        </div>

                        <br />

                        <Button block size="lg" onClick={() => setModal(
                            <CreateOrEditOrganization
                                onSubmit={() => { hideModal() }}
                                organization={null} />, "New Organization"
                        )}>
                            <b>Create organization</b>
                        </Button>
                    </>
                )
            }

            <Modal />
        </main>
    );
}
