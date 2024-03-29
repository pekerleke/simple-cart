import React, { useState } from 'react'

import styles from "./createOrEditProduct.module.scss";
import { Button, Input } from 'rsuite';

interface Props {
    product?: any
    onSubmit :() => void
}

export const CreateOrEditProduct = (props: Props) => {
    console.log("create or edit")

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

        console.log(values);

        if (productPosition > -1) {
            console.log()
            productList[productPosition] = values;
            localStorage.setItem("products", JSON.stringify(productList))
        } else {
            // create
            localStorage.setItem("products", JSON.stringify([...productList, values]))
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
