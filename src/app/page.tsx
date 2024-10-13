"use client"

import { Cart } from "@/components/cart/Cart";
import { Button } from "rsuite";
import useModal from "./hooks/useModal";
import { CreateOrEditOrganization } from "@/components/modal-content/CreateOrEditOrganization";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {

    const { Modal, setModal, hideModal } = useModal();

    const [organizations, setOrganizations] = useState([]);

    const getOrganizations = async () => {
        const response = await fetch(`/api/organizations`);
        const { data, error } = await response.json();
        console.log(data);

        setOrganizations(data);
    }

    useEffect(() => {
        getOrganizations();
    }, [])


    return (
        <main>
            {
                organizations?.map(organization => (
                    <Link href={`/${organization.id}`}>
                        <div style={{ backgroundColor: "#f2f2f2", padding: 20 }}>{organization.name}</div>
                    </Link>
                ))
            }

            <br />

            <Button onClick={() => setModal(
                <CreateOrEditOrganization
                    onSubmit={() => { /*getProducts();*/ hideModal() }}
                    organization={null} />, "New Organization"
            )}>Create organization</Button>

            <hr />
            <Cart />

            <Modal />
        </main>
    );
}
