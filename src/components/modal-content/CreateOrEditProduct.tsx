import React, { useState } from 'react'
import { Button, Input } from 'rsuite';
import { Product } from '@/models/Product';

import styles from "./createOrEditProduct.module.scss";

interface Props {
    product?: Product
    organizationId?: string
    onSubmit: () => void
}

export const CreateOrEditProduct = (props: Props) => {

    const { product, organizationId, onSubmit } = props;

    const [isLoading, setIsLoading] = useState(false);

    const [values, setValues] = useState<Product>({
        id: product?.id || "",
        name: product?.name || "",
        price: product?.price,
        priority: product?.priority
    })

    const handleSubmit = async () => {
        setIsLoading(true);
        await fetch(`/api/products?organizationId=${organizationId}`, {
            method: product ? 'PATCH' : 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: values.id, name: values.name, price: values.price || 0, priority: values.priority || 0 }),
        }).then((res) => res.json())
        .finally(() => setIsLoading(false));

        onSubmit();
    }

    return (
        <div className={styles.container}>
            <div>
                <b>Name</b>
                <Input placeholder='Product name' value={values.name} onChange={(value) => setValues(prev => ({ ...prev, name: value }))} />
            </div>

            <div>
                <b>Price</b>
                <Input placeholder='Product price' type='number' value={values.price} onChange={(value) => setValues(prev => ({ ...prev, price: parseInt(value) }))} />
            </div>

            <div>
                <b>Priority</b>
                <Input placeholder='Product priority' type='number' value={values.priority} onChange={(value) => setValues(prev => ({ ...prev, priority: parseInt(value) }))} />
            </div>

            <Button loading={isLoading} disabled={isLoading} onClick={() => handleSubmit()}><b>Save</b></Button>
        </div>
    )
}
