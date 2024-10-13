import React, { useState } from 'react'
import { Button, Input } from 'rsuite';
import { toast } from 'react-toastify';
import { Product } from '@/models/Product';

import styles from "./createOrEditProduct.module.scss";
import createOrEditGroup from '@/actions/createOrEditProduct';
import getUserData from '@/actions/getUserData';

interface Props {
    product?: Product
    organizationId?: string
    onSubmit: () => void
}

export const CreateOrEditProduct = (props: Props) => {

    const { product, organizationId, onSubmit } = props;

    console.log(product);
    console.log("organizationId:", organizationId);

    const [values, setValues] = useState<Product>({
        id: product?.id || "",
        name: product?.name || "",
        price: product?.price || 0,
        priority: product?.priority || 0,
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

        const { data, error } = await fetch(`/api/products?organizationId=${organizationId}`, {
            method: product ? 'PATCH' : 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: values.id, name: values.name, price: values.price, priority: values.priority }),
        }).then((res) => res.json());

        onSubmit();
    }

    // const handleAddProduct = async () => {
    //     'use server';

    //     // const skill = formData.get('skill');

    //     // if (!skill) return;

    //     const [formResponse, formError] = await createOrEditGroup(product);

    //     if (formError) {
    //         console.log(formError);
    //         return;
    //     }

    //     // revalidatePath('/profile');
    // };

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
