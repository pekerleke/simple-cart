import { useParams } from 'next/navigation';
import { createContext, useState } from 'react';
import { useQuery } from 'react-query';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {

//     const [value, setValue] = useState({
//         storagedData: JSON.parse(localStorage.getItem('sessionData')) || {}
//     });

//     const logout = () => {
//         localStorage.clear();
//         setValue({storagedData: null});
//     }

//     return (
//         <AuthContext.Provider value={{ value, setValue, logout }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };


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