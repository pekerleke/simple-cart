import React, { useState } from 'react'
import { Button, Input } from 'rsuite';
import { toast } from 'react-toastify';

import styles from "./createOrEditProduct.module.scss";

interface Props {
    product?: any
    onSubmit :() => void
}

export const CreateOrEditProduct = (props: Props) => {

    const { product, onSubmit } = props;

    const [values, setValues] = useState({
        id: product?.id || crypto.randomUUID(),
        name: product?.name || "",
        price: product?.price || "",
        priority: product?.priority || "",
    })

    const handleSubmit = () => {
        const productList = JSON.parse(localStorage.getItem("products") || "[]");

        const productPosition = productList.findIndex((product: any) => product.id === values.id);

        if (productPosition > -1) {
            productList[productPosition] = values;
            localStorage.setItem("products", JSON.stringify(productList))
            toast.success("Product edited")
        } else {
            localStorage.setItem("products", JSON.stringify([...productList, values]));
            toast.success("Product created")
        }
        onSubmit();
    }

    return (
        <div className={styles.container}>
            Name
            <Input value={values.name} onChange={(value) => setValues(prev => ({...prev, name: value}))}/>

            Price
            <Input type='number' value={values.price} onChange={(value) => setValues(prev => ({...prev, price: value}))}/>

            Priority
            <Input type='number' value={values.priority} onChange={(value) => setValues(prev => ({...prev, priority: value}))}/>

            <Button onClick={() => handleSubmit()}>Save</Button>
        </div>
    )
}
