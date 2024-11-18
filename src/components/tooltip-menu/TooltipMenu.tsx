import React, { useState } from 'react'
import { useClickOutside } from '@/hooks/useClickOutside';
import classNames from 'classnames';

import styles from "./tooltipMenu.module.scss";

interface Props {
    children: JSX.Element,
    menuItems: MenuItem[]
}

interface MenuItem {
    label: string | JSX.Element,
    action: () => void,
    color?: "red" 
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
    menuItems: MenuItem[]
}

const Menu = (props: MenuProps) => {
    const { menuItems, onClose } = props;

    const { ref } = useClickOutside(onClose);

    return (
        <div ref={ref} className={styles.tooltipMenu}>
            {menuItems.map((item, index) => (
                <div key={index} className={classNames(styles.item, {[styles[item.color || ""]]: Boolean(item.color)})} onClick={item.action}>
                    {item.label}
                </div>
            ))}
        </div>
    )
}