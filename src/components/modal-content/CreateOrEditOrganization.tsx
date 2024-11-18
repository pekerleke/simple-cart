import { useState } from "react";
import styles from "./CreateOrEditOrganization.module.scss";
import { Button, Input } from 'rsuite';
import { v4 as uuidv4 } from 'uuid';
import { isDemo } from "@/utils/demo";

interface Props {
    organization?: any
    onSubmit: () => void
}

export const CreateOrEditOrganization = (props: Props) => {
    const { organization, onSubmit } = props;

    const [isLoading, setIsLoading] = useState(false);

    const [values, setValues] = useState<any>({
        id: organization?.id || "",
        name: organization?.name || ""
    });

    const handleSubmit = async () => {
        if (isDemo()) {
            const demoOrganizations = JSON.parse(localStorage.getItem("demoOrganizations") || "[]");

            if (organization) {
                const foundOrganization = demoOrganizations.find((demoOrganization: any) => demoOrganization.id === organization.id);
                foundOrganization.name = values.name;
            } else {
                demoOrganizations.push({
                    id: uuidv4(),
                    name: values.name,
                    creator_id: "demo",
                    organization_participants: [
                        {
                            user_id: "demo",
                            users: {
                                avatar_url: "/192-logo.png",
                                full_name: "Demo"
                            }
                        }
                    ],
                    products: []
                })
            }

            localStorage.setItem("demoOrganizations", JSON.stringify(demoOrganizations));
        } else {
            setIsLoading(true);
            const { data, error } = await fetch('/api/organizations', {
                method: organization ? 'PATCH' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: values.id, name: values.name, price: values.price, priority: values.priority }),
            }).then((res) => res.json())
                .finally(() => setIsLoading(false));
        }

        onSubmit();
    }


    return (
        <div className={styles.container}>
            <div>
                Name
                <Input placeholder="Organization name" value={values.name} onChange={(value) => setValues((prev: any) => ({ ...prev, name: value }))} />
            </div>
            <Button loading={isLoading} disabled={isLoading} onClick={() => handleSubmit()}>Save</Button>
        </div>
    )
}