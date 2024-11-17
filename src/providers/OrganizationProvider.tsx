"use client"

import { useParams } from 'next/navigation';
import { createContext } from 'react';
import { useQuery } from 'react-query';
import { isDemo } from '@/utils/demo';

export const OrganizationContext = createContext({
    organization: null,
    status: "",
    sales: [],
    salesStatus: "",
    refetch: () => { },
    salesRefetch: () => {}
});

export const OrganizationProvider = ({ children }: any) => {

    const { organization: organizationId } = useParams();

    const { data, status, refetch } = useQuery({
        queryKey: [organizationId],
        queryFn: () => {
            if (isDemo()) {
                const demoOrganizations = JSON.parse(localStorage.getItem("demoOrganizations") || "[]");
                return demoOrganizations.find((organization: any) => organization.id === organizationId);
            } else {
                return fetch(`/api/organizations/${organizationId}`)
                    .then(res => res.json())
                    .then(data => data.organization)
                    .catch(err => console.error(err))
            }
        },
    })

    const { data: salesData, status: salesStatus, refetch: salesRefetch } = useQuery({
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

    const context = {
        organization: data,
        status,
        refetch,
        sales: salesData,
        salesStatus,
        salesRefetch,
    }

    return (
        <OrganizationContext.Provider value={context} >
            {children}
        </OrganizationContext.Provider >
    )
}