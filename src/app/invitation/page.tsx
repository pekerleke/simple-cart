import { Suspense } from "react";
import { InnerInvitationPage } from "./InnerInvitationPage";
import type { Metadata, ResolvingMetadata } from 'next'
import { cookies } from "next/headers";
import initTranslations from "../i18n";

export async function generateMetadata(
    { params, searchParams }: any,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const invitationCode = searchParams.invitationCode;

    const locale = cookies().get("locale")?.value || "en";
    const { t: translate } = await initTranslations(locale);

    const invitation = await fetch(`https://simple-cart-ruddy.vercel.app/api/organizations/invite?invitationCode=${invitationCode}`).then((res) => res.json())

    const organizationName = invitation?.data?.organizations?.name || "organization"

    return {
        title: translate("joinOrganizationMessage", {name: organizationName}),
        description: translate("acceptInvitationMessage", {name: organizationName}),
        openGraph: {
            title: translate("joinOrganizationMessage", {name: organizationName}),
            description: translate("acceptInvitationMessage", {name: organizationName}),
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