"use client"

import { useParams } from 'next/navigation';
import { createContext } from 'react';
import { useQuery } from 'react-query';
import { isDemo } from '@/utils/demo';

export const SalesContext = createContext({
    sales: [],
    salesStatus: "",
    salesRefetch: () => { }
});

export const SalesProvider = ({ children }: any) => {

    const { organization: organizationId } = useParams();

    const { data: salesData, status: salesStatus, refetch: salesRefetch } = useQuery({
        queryKey: [`${organizationId}-sales`],
        queryFn: () => {
            if (isDemo()) {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        const demoSales = JSON.parse(localStorage.getItem("demoSales") || "[]")
                            .filter((sale: any) => sale.organization_id === organizationId);
                        resolve([...demoSales]);
                    }, 500);
                });
            } else {
                return fetch(`/api/sales?organizationId=${organizationId}`)
                    .then(res => res.json())
                    .then(data => data.data)
                    .catch(err => console.error(err))
            }
        },
    })

    const context = {
        sales: salesData,
        salesStatus,
        salesRefetch,
    }

    return (
        <SalesContext.Provider value={context} >
            {children}
        </SalesContext.Provider >
    )
}