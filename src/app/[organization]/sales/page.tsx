"use client"

import useModal from '@/app/hooks/useModal';
import { ViewSalesInfo } from '@/components/modal-content/ViewSalesInfo';
import { Product } from '@/models/Product';
import { Sale } from '@/models/Sale';
import dayjs from 'dayjs';
import { useParams } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import Loader from '@/components/loader/Loader';
import { Message } from '@/components/message/Message';
import { AuthContext } from '@/providers/AuthProvider';

import styles from "./styles.module.scss";
import { EmptyAdvice } from '@/components/empty-advice/EmptyAdvice';

export default function Sales() {
    const params = useParams();
    const organizationId = params.organization;

    const [groupedSales, setGroupedSales] = useState<{ [date: string]: Sale[] }>({});

    const { isDemo } = useContext(AuthContext);

    const { Modal, setModal } = useModal();

    const { data, status } = useQuery({
        queryKey: [`${organizationId}-sales`],
        queryFn: () => {
            if (isDemo) {
                const demoSales = JSON.parse(localStorage.getItem("demoSales") || "[]").filter((sale: any) => sale.organization_id === organizationId);
                return [...demoSales];
            } else {
                return fetch(`/api/sales?organizationId=${organizationId}`)
                    .then(res => res.json())
                    .then(data => data.data)
                    .catch(err => console.error(err))
            }
        },
    })

    useEffect(() => {
        if (data) {
            const groupedSales = data
                .sort((a: any, b: any) => new Date(a.created_at).getTime() < new Date(b.created_at).getTime() ? 1 : -1)
                .reduce((acc: { [date: string]: Sale[] }, item: any) => {
                    const date = item.created_at.split('T')[0];

                    if (!acc[date]) {
                        acc[date] = [];
                    }

                    acc[date].push(item);

                    return acc;
                }, {})
            setGroupedSales(groupedSales);
        }
    }, [data])

    if (status === "loading") {
        return (
            <Loader />
        )
    }

    if ((status === "success") && !Boolean(data.length)) {
        return (
            <EmptyAdvice title='No sales recorded yet'>
                <div>Start selling your products and your sales data will appear here.</div>
            </EmptyAdvice>
        )
    }

    return (
        <div>
            {
                Object.keys(groupedSales)?.map(groupKey => (
                    <div key={groupKey}>
                        <div className={styles.dayTitle}>
                            <h3 className={styles.groupTitle}>{dayjs(groupKey).format("ddd DD MMM YYYY")}</h3>
                            <div className={styles.detailButton} onClick={() => setModal(<ViewSalesInfo salesInfo={groupedSales[groupKey]} />, dayjs(groupKey).format("ddd DD MMM YYYY"))}>Details</div>
                        </div>
                        <div className={styles.salesContainer}>
                            {(groupedSales[groupKey]).map((sale: Sale, index: number) => (
                                <div key={index} className={styles.sale}>
                                    <div className={styles.saleTitle}>
                                        <div className={styles.productQuantity}>{sale.products.length} products</div>
                                        <div>{dayjs(sale.created_at).format('DD/MM/YYYY - HH:mm')}</div>
                                    </div>
                                    <div className={styles.products}>
                                        {sale.products.map((product: Product, index: number) => (
                                            <div key={index}>
                                                {product.name}
                                            </div>
                                        ))}
                                    </div>
                                    <div className={styles.total}>Total: ${sale.products.reduce((accumulator: number, saleProduct: Product) => accumulator + ((saleProduct as any).price || 0), 0).toLocaleString('es-AR')}</div>
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