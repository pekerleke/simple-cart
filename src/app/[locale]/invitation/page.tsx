import { Suspense } from "react";
import { InnerInvitationPage } from "./InnerInvitationPage";
import type { Metadata, ResolvingMetadata } from 'next'

export async function generateMetadata(
    { params, searchParams }: any,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const invitationCode = searchParams.invitationCode;

    const invitation = await fetch(`https://simple-cart-ruddy.vercel.app/api/organizations/invite?invitationCode=${invitationCode}`).then((res) => res.json())

    const organizationName = invitation?.data?.organizations?.name || "organization"

    return {
        title: `Join ${organizationName} | Simple Cart`,
        description: `Accept your invitation to join ${organizationName} on SimpleCart.`,
        openGraph: {
            title: `Join ${organizationName} | Simple Cart`,
            description: `Accept your invitation to join ${organizationName} on SimpleCart.`,
            images: ['https://simple-cart-ruddy.vercel.app/cover.jpg'],
            url: `https://simple-cart-ruddy.vercel.app/invitation?invitationCode=${invitationCode}`,
            siteName: "Simple Cart",
        },
    }
}

export default function InvitationPage() {
    return (
        <Suspense>
            <InnerInvitationPage />
        </Suspense>
    )
}