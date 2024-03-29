"use client"

import { useEffect, useState } from "react";

import styles from "./sales.module.scss";
import dayjs from "dayjs";

export default function Home() {

    const [sales, setSales] = useState<any>();


    const getSales = () => {
        setSales(JSON.parse(localStorage.getItem("sales") || "[]"));
    }

    useEffect(() => {
        getSales();
    }, [])


    return (
        <div>
            <h3>Sales</h3>
            <br />
            <div className={styles.salesContainer}>
                {
                    sales?.sort((a: any, b: any) => new Date(a.date).getTime() < new Date(b.date).getTime() ? 1 : -1).map((sale: any) => (
                        <div className={styles.sale}>
                            <div className={styles.date}>{dayjs(sale.date).format('ddd DD MMM YYYY - HH:mm')}</div>
                            <div className={styles.products}>
                                {sale.products.map((product: any) => (
                                    <div>
                                        {product.name}
                                    </div>
                                ))}
                            </div>
                            <div className={styles.total}>Total: ${sale.products.reduce((accumulator: number, producto: any) => accumulator + parseInt(producto.price), 0)}</div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}