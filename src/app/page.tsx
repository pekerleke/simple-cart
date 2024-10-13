"use client"

import { Button } from "rsuite";
import useModal from "./hooks/useModal";
import { CreateOrEditOrganization } from "@/components/modal-content/CreateOrEditOrganization";
import { useEffect, useState } from "react";
import Link from "next/link";

import styles from "./styles.module.scss";

export default function Home() {

    const { Modal, setModal, hideModal } = useModal();

    const [organizations, setOrganizations] = useState([]);

    const getOrganizations = async () => {
        const response = await fetch(`/api/organizations`);
        const { data, error } = await response.json();

        setOrganizations(data);
    }

    useEffect(() => {
        getOrganizations();
    }, [])


    return (
        <main style={{ padding: 10, maxWidth: 1024, margin: "auto" }}>
            <div className={styles.organizationsContainer}>
                {
                    organizations?.map((organization: any) => (
                        <Link className={styles.link} key={organization.id} href={`/${organization.id}`}>
                            {organization.name}
                        </Link>
                    ))
                }
            </div>

            <br />

            <Button block onClick={() => setModal(
                <CreateOrEditOrganization
                    onSubmit={() => { hideModal() }}
                    organization={null} />, "New Organization"
            )}>Create organization</Button>

            <Modal />
        </main>
    );
}
