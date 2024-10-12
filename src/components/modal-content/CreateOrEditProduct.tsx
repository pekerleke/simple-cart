import React, { useState } from 'react'
import { Button, Input } from 'rsuite';
import { toast } from 'react-toastify';
import { Product } from '@/models/Product';

import styles from "./createOrEditProduct.module.scss";

interface Props {
    product?: Product
    onSubmit: () => void
}

export const CreateOrEditProduct = (props: Props) => {

    const { product, onSubmit } = props;

    const [values, setValues] = useState<Product>({
        id: product?.id || crypto.randomUUID(),
        name: product?.name || "",
        price: product?.price || 0,
        priority: product?.priority || 0,
    })

    const handleSubmit = async () => {
        const productList = JSON.parse(localStorage.getItem("products") || "[]");

        const productPosition = productList.findIndex((product: Product) => product.id === values.id);

        if (productPosition > -1) {
            productList[productPosition] = values;
            localStorage.setItem("products", JSON.stringify(productList))
            toast.success("Product edited")
        } else {
            localStorage.setItem("products", JSON.stringify([...productList, values]));
            toast.success("Product created")
        }

        const response = await fetch('/api/products/addProduct', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: product?.name, price: product?.price, priority: product?.priority }),
        });

        if (response.ok) {
            console.log("Product added successfully!");
            // Limpia el formulario o realiza otras acciones
        } else {
            console.error("Error adding product.");
        }


        onSubmit();
    }

    return (
        <div className={styles.container}>
            Name
            <Input value={values.name} onChange={(value) => setValues(prev => ({ ...prev, name: value }))} />

            Price
            <Input type='number' value={values.price} onChange={(value) => setValues(prev => ({ ...prev, price: parseInt(value) }))} />

            Priority
            <Input type='number' value={values.priority} onChange={(value) => setValues(prev => ({ ...prev, priority: parseInt(value) }))} />

            <Button onClick={() => handleSubmit()}>Save</Button>
        </div>
    )
}
