import { useState } from "react";
import styles from "./CreateOrEditOrganization.module.scss";
import { Button, Input } from 'rsuite';

interface Props {
    organization?: any
    onSubmit: () => void
}

export const CreateOrEditOrganization = (props: Props) => {
    const { organization, onSubmit } = props;

    const [values, setValues] = useState<any>({
        id: organization?.id || "",
        name: organization?.name || ""
    })

    const handleSubmit = async () => {
        const { data, error } = await fetch('/api/organizations', {
            method: organization ? 'PATCH' : 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: values.id, name: values.name, price: values.price, priority: values.priority }),
        }).then((res) => res.json());

        onSubmit();
    }


    return (
        <div className={styles.container}>
            Name
            <Input value={values.name} onChange={(value) => setValues((prev: any) => ({ ...prev, name: value }))} />
            <Button onClick={() => handleSubmit()}>Save</Button>
        </div>
    )
}