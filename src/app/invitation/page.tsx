import { Suspense } from "react";
import { InnerInvitationPage } from "./InnerInvitationPage";


export async function generateMetadata({ searchParams }: any) {
    const invitationCode = searchParams.invitationCode;
  
    const data = await fetch(
      `https://simple-cart-ruddy.vercel.app/api/organizations/invite?invitationCode=${invitationCode}`
    )
      .then((res) => res.json())
      .then((response) => response.data)
      .catch(() => null);
  
    const organizationName = data?.organizations?.name || "SimpleCart";
  
    return {
      title: `Join ${organizationName} | Simple Cart`,
      description: `Accept your invitation to join ${organizationName} on SimpleCart.`,
      openGraph: {
        title: `Join ${organizationName}`,
        description: `Join ${organizationName} on SimpleCart with this invitation.`,
        url: `https://simple-cart-ruddy.vercel.app/invitation?invitationCode=${invitationCode}`,
        images: [
          {
            url: "https://simple-cart-ruddy.vercel.app/cover.jpg",
            width: 1200,
            height: 630,
          },
        ],
        siteName: "Simple Cart",
      },
    };
  }

export default function InvitationPage() {
    return (
        <Suspense>
            <InnerInvitationPage />
        </Suspense>
    )
}