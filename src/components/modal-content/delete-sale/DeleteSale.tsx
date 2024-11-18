import { Sale } from '@/models/Sale'
import { isDemo } from '@/utils/demo';
import React, { useState } from 'react'
import { toast } from 'react-toastify';
import { Button, Message } from 'rsuite';
import dayjs from 'dayjs';

import styles from "./deleteSale.module.scss";

interface Props {
    onSuccess: () => void
    onCancel: () => void
    sale: Sale
}

export const DeleteSale = (props: Props) => {
    const { sale, onSuccess, onCancel } = props;

    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = async () => {
        if (isDemo()) {
            const demoSales = JSON.parse(localStorage.getItem("demoSales") || "[]");
            const tempSales = demoSales.filter((demoSale: Sale) => demoSale.id !== sale.id);
            localStorage.setItem("demoSales", JSON.stringify(tempSales));
        } else {
            setIsLoading(true);
            await fetch('/api/sales', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: sale.id }),
            }).finally(() => setIsLoading(true));
        }
        toast.success("Removed!");
        onSuccess();
    }

    return (
        <div>
            <Message type="warning">
                Are you sure to remove this sale from <b>{dayjs(sale.created_at).format('DD/MM/YYYY - HH:mm')}</b> with <b>{sale.products.length} {sale.products.length === 1 ? "product" : "products"}</b>? 
            </Message>
            <br />
            <div className={styles.buttonContainer}>
                <Button onClick={onCancel} disabled={isLoading}>Cancel</Button>
                <Button color='red' appearance='primary' onClick={handleDelete} disabled={isLoading} loading={isLoading}>Yes, Remove</Button>
            </div>
        </div>
    )
}
