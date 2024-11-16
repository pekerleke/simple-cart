import React, { useState } from 'react'
import { Button, Input } from 'rsuite';
import { Product } from '@/models/Product';
import { v4 as uuidv4 } from 'uuid';

import styles from "./createOrEditProduct.module.scss";
import { isDemo } from '@/utils/demo';

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

        if (isDemo()) {
            const demoOrganizations = JSON.parse(localStorage.getItem("demoOrganizations") || "[]");
            const organization = demoOrganizations.find((organization: any) => organization.id === organizationId);

            if (!product) {   
                organization.products.push(
                    { id: uuidv4(), name: values.name, price: values.price || 0, priority: values.priority || 0 }
                )
            } else {
                const newProduct = organization.products.find((organizationProduct: any) => organizationProduct.id === product.id);
                newProduct.name = values.name;
                newProduct.price = values.price || 0;
                newProduct.priority = values.priority || 0;
            }



            localStorage.setItem("demoOrganizations", JSON.stringify(demoOrganizations));
        } else {
            setIsLoading(true);
            await fetch(`/api/products?organizationId=${organizationId}`, {
                method: product ? 'PATCH' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: values.id, name: values.name, price: values.price || 0, priority: values.priority || 0 }),
            }).then((res) => res.json())
            .finally(() => setIsLoading(false));
        }
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
