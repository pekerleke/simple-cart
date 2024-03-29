import React from 'react'
import { Button } from 'rsuite';

interface Props {
    onDelete: () => void
    onCancel: () => void
    product: any
}

export const DeleteProduct = (props: Props) => {
    const { product, onDelete, onCancel } = props;

    const handleDelete = () => {
        console.log("delete");
        onDelete();
    }

    return (
        <div>
            <p>Are you sure you wanbt to delete "{product.name}"</p>
            <Button onClick={handleDelete}>Eliminar</Button>
            <Button onClick={onCancel}>Cancelar</Button>
        </div>
    )
}
