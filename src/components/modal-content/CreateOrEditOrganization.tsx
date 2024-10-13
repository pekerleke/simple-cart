import { useState } from "react";
import styles from "./CreateOrEditOrganization.module.scss";
import { Button, Input } from 'rsuite';

interface Props {
    organization?: any
    onSubmit: () => void
}

export const CreateOrEditOrganization = (props: Props) => {
    const { organization, onSubmit } = props;

    console.log(organization);

    const [values, setValues] = useState<any>({
        id: organization?.id || "",
        name: organization?.name || ""
    })

    const handleSubmit = async () => {
        // const productList = JSON.parse(localStorage.getItem("products") || "[]");

        // const productPosition = productList.findIndex((product: Product) => product.id === values.id);

        // if (productPosition > -1) {
        //     productList[productPosition] = values;
        //     localStorage.setItem("products", JSON.stringify(productList))
        //     toast.success("Product edited")
        // } else {
        //     localStorage.setItem("products", JSON.stringify([...productList, values]));
        //     toast.success("Product created")
        // }

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
            <Input value={values.name} onChange={(value) => setValues(prev => ({ ...prev, name: value }))} />
            <Button onClick={() => handleSubmit()}>Save</Button>
        </div>
    )
}