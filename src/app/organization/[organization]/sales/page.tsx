"use client"

import { Sale } from '@/models/Sale';
import { useContext, useEffect, useState } from 'react';
import Loader from '@/components/loader/Loader';
import { EmptyAdvice } from '@/components/empty-advice/EmptyAdvice';
import { SalesGroup } from './SalesGroup';
import { OrganizationContext } from '@/providers/OrganizationProvider';

export default function Sales() {
    const { sales, salesStatus } = useContext(OrganizationContext);

    const [groupedSales, setGroupedSales] = useState<{ [date: string]: Sale[] }>({});

    useEffect(() => {
        if (sales.length) {
            const groupedSales = sales
                .sort((a: any, b: any) => new Date(a.created_at).getTime() < new Date(b.created_at).getTime() ? 1 : -1)
                .reduce((acc: { [date: string]: Sale[] }, item: any) => {
                    const date = item.created_at.split('T')[0];

                    if (!acc[date]) {
                        acc[date] = [];
                    }

                    acc[date].push(item);

                    return acc;
                }, {})
            console.log("GROUOPED SALESSS")
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
            <EmptyAdvice title='No sales recorded yet'>
                <div>Start selling your products and your sales data will appear here.</div>
            </EmptyAdvice>
        )
    }

    return (
        <div>
            {
                Object.keys(groupedSales)?.map((groupKey, index: number) => (
                    <div key={groupKey} style={{marginBottom: 8}}>
                        <SalesGroup key={groupKey} groupKey={groupKey} salesGroup={groupedSales[groupKey]} open={index === 0}/>
                    </div>
                ))
            }
        </div>
    )
}