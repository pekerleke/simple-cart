import { useClickOutside } from '@/hooks/useClickOutside';
import React, { useState } from 'react'

import styles from "./tooltipMenu.module.scss";

interface Props {
    children: JSX.Element,
    menuItems: {
        label: string,
        action: () => void
    }[]
}

export const TooltipMenu = (props: Props) => {
    const { children, menuItems } = props;

    const [showMenu, setShowMenu] = useState(false);

    return (
        <div className={styles.container}>
            <div className={styles.children} onClick={() => setShowMenu(true)}>
                {children}
            </div>

            {showMenu && <Menu menuItems={menuItems} onClose={() => setShowMenu(false)}/>}
        </div>
    )
}

interface MenuProps {
    onClose: () => void,
    menuItems: {
        label: string,
        action: () => void
    }[]
}

const Menu = (props: MenuProps) => {
    const { menuItems, onClose } = props;

    const { ref } = useClickOutside(onClose);

    return (
        <div ref={ref} className={styles.tooltipMenu}>
            {menuItems.map(item => (
                <div key={item.label} className={styles.item} onClick={item.action}>
                    {item.label}
                </div>
            ))}
        </div>
    )
}