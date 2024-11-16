"use client"

import { Sale } from '@/models/Sale';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import Loader from '@/components/loader/Loader';
import { EmptyAdvice } from '@/components/empty-advice/EmptyAdvice';
import { isDemo } from '@/utils/demo';
import { SalesGroup } from './SalesGroup';

export default function Sales() {
    const params = useParams();
    const organizationId = params.organization;

    const [groupedSales, setGroupedSales] = useState<{ [date: string]: Sale[] }>({});

    const { data, status } = useQuery({
        queryKey: [`${organizationId}-sales`],
        queryFn: () => {
            if (isDemo()) {
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
                Object.keys(groupedSales)?.map((groupKey, index: number) => (
                    <>
                        <SalesGroup key={groupKey} groupKey={groupKey} salesGroup={groupedSales[groupKey]} open={index === 0}/>
                        <br />
                    </>
                ))
            }
        </div>
    )
}