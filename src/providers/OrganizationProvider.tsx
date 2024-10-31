"use client"

import { useParams } from 'next/navigation';
import { createContext } from 'react';
import { useQuery } from 'react-query';

export const OrganizationContext = createContext({
    organization: null,
    status: "",
    refetch: () => { }
});


export const OrganizationProvider = ({ children }: any) => {

    const { organization: organizationId } = useParams();

    const { data, status, refetch } = useQuery({
        queryKey: [organizationId],
        queryFn: () => fetch(`/api/organizations/${organizationId}`)
            .then(res => res.json())
            .then(data => data.organization)
            .catch(err => console.error(err)),
    })

    const context = {
        organization: data,
        status,
        refetch
    }

    return (
        <OrganizationContext.Provider value={context} >
            {children}
        </OrganizationContext.Provider >
    )
}