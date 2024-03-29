import React from 'react'
import { Button, Message } from 'rsuite';
import { toast } from 'react-toastify';

import styles from "./deleteProduct.module.scss";

interface Props {
    onDelete: () => void
    onCancel: () => void
    product: any
}

export const DeleteProduct = (props: Props) => {
    const { product, onDelete, onCancel } = props;

    const handleDelete = () => {
        toast.success("Product removed")
        onDelete();
    }

    return (
        <div>
            <Message type="warning">
                Are you sure to remove the product <strong>{product.name}</strong>?
            </Message>
            <br />
            <div className={styles.buttonContainer}>
                <Button onClick={onCancel}>Cancel</Button>
                <Button color='red' appearance='primary' onClick={handleDelete}>Yes, Remove</Button>
            </div>
        </div>
    )
}
