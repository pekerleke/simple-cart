import React from 'react'


import styles from "./navbar.module.scss";
import Link from 'next/link';

export const Navbar = () => {
  return (
    <div className={styles.container}>
      <Link href="/" className={styles.logo}>Simple Cart</Link>

      <div className={styles.pages}>
        <Link href="/sales">Sales</Link>
        <Link href="/settings">Settings</Link>
      </div>
    </div>
  )
}
