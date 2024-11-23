"use client"

import { Button } from "rsuite";
import useModal from "../hooks/useModal";
import { CreateOrEditOrganization } from "@/components/modal-content/CreateOrEditOrganization";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { stringToColor } from "@/utils/stringToColor";
import Loader from "@/components/loader/Loader";
import { MdAdd } from "react-icons/md";
import { EmptyAdvice } from "@/components/empty-advice/EmptyAdvice";
import { isDemo } from "@/utils/demo";

import styles from "./styles.module.scss";

export default function Home() {

    const { Modal, setModal, hideModal } = useModal();

    const [isLoading, setIsLoading] = useState(true);

    const [organizations, setOrganizations] = useState([]);

    const getOrganizations = async () => {
        if (isDemo()) {
            const demoOrganizations = JSON.parse(localStorage.getItem("demoOrganizations") || "[]");
            setOrganizations(demoOrganizations);
            setIsLoading(false);
        } else {
            const response = await fetch(`/api/organizations`);
            const { data, error } = await response.json();

            setOrganizations(data);
            setIsLoading(false);
        }
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
                                        <Link prefetch className={styles.link} key={organization.id} href={`/organization/${organization.id}`}>
                                            <div className={styles.organizationAvatar} style={{ backgroundColor: avatarColors.pastel, color: avatarColors.contrast }}>
                                                {(organization as any)?.name[0]}
                                            </div>
                                            <h3>{organization.name}</h3>
                                        </Link>
                                    )
                                })
                            }
                        </div>


                        {
                            !organizations?.length && (
                                <EmptyAdvice title='You don’t have any organizations yet.'>
                                    <div>Create your first one to get started!</div>
                                </EmptyAdvice>
                            )
                        }


                        <br />

                        <Button block size="lg" onClick={() => setModal(
                            <CreateOrEditOrganization
                                onSubmit={() => { getOrganizations(); hideModal() }}
                                organization={null} />, "New Organization"
                        )}>
                            <div className={styles.buttonText}><MdAdd /> Create organization</div>
                        </Button>
                    </>
                )
            }

            <Modal />
        </main>
    );
}
