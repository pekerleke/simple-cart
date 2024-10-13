"use client"

import { Cart } from "@/components/cart/Cart";
import { OrganizationContext } from "@/providers/OrganizationProvider";
import { useParams } from 'next/navigation';
import { useContext } from "react";

export default function Organization() {
    const { organization: organizationId } = useParams();
    const { organization, status } = useContext(OrganizationContext);

    return <Cart status={status} products={(organization as any)?.products || []} organizationId={organizationId as string} />;
}
