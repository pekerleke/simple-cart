import React, { useState } from 'react'
import { Button, Message } from 'rsuite';
import { toast } from 'react-toastify';
import { Product } from '@/models/Product';

import styles from "./deleteProduct.module.scss";

interface Props {
    onDelete: () => void
    onCancel: () => void
    product: Product
}

export const DeleteProduct = (props: Props) => {
    const { product, onDelete, onCancel } = props;

    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = async () => {
        setIsLoading(true);
        await fetch('/api/products', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: product.id }),
        }).finally(() => setIsLoading(true));
        toast.success("Removed!");
        onDelete();
    }

    return (
        <div>
            <Message type="warning">
                Are you sure to remove the product <strong>{product.name}</strong>?
            </Message>
            <br />
            <div className={styles.buttonContainer}>
                <Button onClick={onCancel} disabled={isLoading}>Cancel</Button>
                <Button color='red' appearance='primary' onClick={handleDelete} disabled={isLoading} loading={isLoading}>Yes, Remove</Button>
            </div>
        </div>
    )
}
