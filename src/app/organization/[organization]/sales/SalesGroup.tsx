"use client"

import { Sale } from '@/models/Sale';
import React, { useState } from 'react'
import useModal from '@/app/hooks/useModal';
import { Product } from '@/models/Product';
import { ViewSalesInfo } from '@/components/modal-content/ViewSalesInfo';
import { FaChevronRight, FaChevronUp } from 'react-icons/fa';
import { MdOutlineCalendarMonth } from 'react-icons/md';
import dayjs from 'dayjs';

import styles from "./sales.module.scss";

interface Props {
    groupKey: string;
    salesGroup: Sale[];
    open?: boolean;
}

export const SalesGroup = (props: Props) => {
    const { groupKey, salesGroup, open = false } = props;

    const { Modal, setModal } = useModal();

    const [show, setShow] = useState(open);

    return (
        <>
            <div className={styles.container}>
                <div className={styles.titleRow}>
                    <div className={styles.titleContainer} onClick={() => setShow(prev => !prev)}>
                        <div className={styles.icon}>{show ? <FaChevronUp /> : <FaChevronRight />}</div>
                        <div className={styles.title}><MdOutlineCalendarMonth /> {dayjs(groupKey).format("ddd DD MMM YYYY")}</div>
                        <div className={styles.salesQuantity}>{salesGroup.length} {salesGroup.length > 1 ? "sales" : "sale" }</div>
                    </div>
                    <div className={styles.detailButton} onClick={() => setModal(<ViewSalesInfo salesInfo={salesGroup} />, dayjs(groupKey).format("ddd DD MMM YYYY"))}>Details</div>
                </div>

                {
                    show && (
                        <div className={styles.salesContainer}>
                            {salesGroup.map((sale: Sale, index: number) => (
                                <div key={index} className={styles.sale}>
                                    <div className={styles.saleTitle}>
                                        <div className={styles.productQuantity}>{sale.products.length} products</div>
                                        <div>{dayjs(sale.created_at).format('DD/MM/YYYY - HH:mm')}</div>
                                    </div>
                                    <div className={styles.products}>
                                        {sale.products.map((product: Product, index: number) => (
                                            <div key={index} className={styles.product}>
                                                <div>{product.name}</div>
                                                <div>${product.price?.toLocaleString('es-AR')}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className={styles.total}>
                                        <div>Total</div>
                                        <div>${sale.products.reduce((accumulator: number, saleProduct: Product) => accumulator + ((saleProduct as any).price || 0), 0).toLocaleString('es-AR')}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                }
            </div>

            <Modal />
        </>
    )
}
