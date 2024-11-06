"use client"

import { useParams } from 'next/navigation';
import { createContext, useContext } from 'react';
import { useQuery } from 'react-query';
import { AuthContext } from './AuthProvider';

export const OrganizationContext = createContext({
    organization: null,
    status: "",
    refetch: () => { }
});

export const OrganizationProvider = ({ children }: any) => {

    const { organization: organizationId } = useParams();

    const { isDemo } = useContext(AuthContext);

    const { data, status, refetch } = useQuery({
        queryKey: [organizationId],
        queryFn: () => {
            if (isDemo) {
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