"use client"

import { Cart } from "@/components/cart/Cart";
import { SessionProvider, signIn, useSession } from "next-auth/react";

export default function Home() {

  return (
    <main>
      <SessionProvider>
        <Cart />
      </SessionProvider>
    </main>
  );
}
