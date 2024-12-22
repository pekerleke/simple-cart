"use client"

import { Sale } from '@/models/Sale';
import { useContext, useEffect, useState } from 'react';
import Loader from '@/components/loader/Loader';
import { EmptyAdvice } from '@/components/empty-advice/EmptyAdvice';
import { SalesGroup } from './SalesGroup';
import { SalesContext, SalesProvider } from '@/providers/SalesProvider';
import { useTranslation } from 'react-i18next';

const InnerSales = () => {
    const { sales, salesStatus } = useContext(SalesContext);

    const [groupedSales, setGroupedSales] = useState<{ [date: string]: Sale[] }>({});

    const { t: translate } = useTranslation();

    useEffect(() => {
        if (sales?.length) {
            const groupedSales = sales
                .sort((a: any, b: any) => new Date(a.created_at).getTime() < new Date(b.created_at).getTime() ? 1 : -1)
                .reduce((acc: { [date: string]: Sale[] }, item: any) => {
                    const date = new Date(item.created_at).toLocaleDateString();

                    if (!acc[date]) {
                        acc[date] = [];
                    }

                    acc[date].push(item);

                    return acc;
                }, {});
            setGroupedSales(groupedSales);
        }
    }, [sales])

    if (salesStatus === "loading") {
        return (
            <Loader />
        )
    }

    if ((salesStatus === "success") && !Boolean(sales?.length)) {
        return (
            <EmptyAdvice title={translate("noSales.advice")}>
                <div>{translate("noSales.advice.content")}</div>
            </EmptyAdvice>
        )
    }

    return (
        <div>
            {
                Object.keys(groupedSales)?.map((groupKey, index: number) => (
                    <div key={groupKey} style={{ marginBottom: 8 }}>
                        <SalesGroup key={groupKey} groupKey={groupKey} salesGroup={groupedSales[groupKey]} open={index === 0} />
                    </div>
                ))
            }
        </div>
    )
}

export default function Sales() {
    return (
        <SalesProvider>
            <InnerSales />
        </SalesProvider>
    )
}