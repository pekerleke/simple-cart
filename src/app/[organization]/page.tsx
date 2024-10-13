"use client"

import { Cart } from "@/components/cart/Cart";
import { Button } from "rsuite";
import { CreateOrEditOrganization } from "@/components/modal-content/CreateOrEditOrganization";
import { useEffect, useState } from "react";
import { useParams } from 'next/navigation';
import Link from "next/link";

export default function Organization() {
    const { organization } = useParams();

    return (
        <div>
            <h3>Organization Page</h3>
            <Link href={`/${organization}/sales`}>Sales</Link>
            <Link href={`/${organization}/settings`}>Settings</Link>
            {/* <p>Organization ID: {organization}</p> */}

            <br /><br />

            <Cart organizationId={organization as string} />
        </div>
    );
}
