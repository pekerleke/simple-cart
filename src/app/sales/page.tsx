"use client"

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Button } from "rsuite";
import useModal from "../hooks/useModal";
import { ViewSalesInfo } from "@/components/modal-content/ViewSalesInfo";
import { Sale } from "@/models/Sale";
import { Product } from "@/models/Product";

import styles from "./sales.module.scss";


export default function Home() {
    const [groupedSales, setGroupedSales] = useState<{[date: string]: Sale[]}>({});

    const { Modal, setModal } = useModal()

    useEffect(() => {
        const groupedSales = JSON.parse(localStorage.getItem("sales") || "[]")
            .sort((a: Sale, b: Sale) => new Date(a.date).getTime() < new Date(b.date).getTime() ? 1 : -1)
            .reduce((acc: {[date: string]: Sale[]}, item: Sale) => {
                const date = item.date.split('T')[0];

                if (!acc[date]) {
                    acc[date] = [];
                }

                acc[date].push(item);

                return acc;
            }, {})
        setGroupedSales(groupedSales);
    }, [])

    return (
        <div>
            <h3>Sales</h3>
            <br />

            {
                Object.keys(groupedSales)?.map(groupKey => (
                    <div key={groupKey}>
                        <div className={styles.dayTitle}>
                            <h3 className={styles.groupTitle}>{dayjs(groupKey).format("ddd DD MMM YYYY")}</h3>
                            <Button appearance="subtle" size="sm" onClick={() => setModal(<ViewSalesInfo salesInfo={groupedSales[groupKey]} />, dayjs(groupKey).format("ddd DD MMM YYYY"))}>Details</Button>
                        </div>
                        <div className={styles.salesContainer}>
                            {(groupedSales[groupKey]).map((sale: Sale) => (
                                <div key={new Date(sale.date).getTime()} className={styles.sale}>
                                    <div className={styles.saleTitle}>
                                        <div className={styles.productQuantity}>{sale.products.length} products</div>
                                        <div>{dayjs(sale.date).format('DD/MM/YYYY - HH:mm')}</div>
                                    </div>
                                    <div className={styles.products}>
                                        {sale.products.map((product: Product, index: number) => (
                                            <div key={index}>
                                                {product.name}
                                            </div>
                                        ))}
                                    </div>
                                    <div className={styles.total}>Total: ${sale.products.reduce((accumulator: number, producto: Product) => accumulator + producto.price, 0).toLocaleString('es-AR')}</div>
                                </div>
                            ))}
                        </div>
                        <br /><br />
                    </div>
                ))
            }

            <Modal />
        </div>
    )
}