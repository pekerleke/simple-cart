import { Sale } from '@/models/Sale'
import { isDemo } from '@/utils/demo';
import React, { useState } from 'react'
import { toast } from 'react-toastify';
import { Button, Message } from 'rsuite';
import dayjs from 'dayjs';
import { Trans, useTranslation } from 'react-i18next';

import styles from "./deleteSale.module.scss";

interface Props {
    onSuccess: () => void
    onCancel: () => void
    sale: Sale
}

export const DeleteSale = (props: Props) => {
    const { sale, onSuccess, onCancel } = props;

    const [isLoading, setIsLoading] = useState(false);

    const { t: translate } = useTranslation();

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
        toast.success(translate("removed"));
        onSuccess();
    }

    return (
        <div>
            <Message type="warning">
                <Trans
                    i18nKey="removeSale.advice"
                    components={{
                        strong: <strong />
                    }}
                    values={{
                        date: dayjs(sale.created_at).format('ddd DD MMM YYYY - HH:mm'),
                        productsQuantity: sale.products.length,
                        productsWord: sale.products.length === 1 ? translate("product") : translate("products")
                    }}
                />

            </Message>
            <br />
            <div className={styles.buttonContainer}>
                <Button onClick={onCancel} disabled={isLoading}>{translate("cancel")}</Button>
                <Button color='red' appearance='primary' onClick={handleDelete} disabled={isLoading} loading={isLoading}>{translate("removeConfirmation")}</Button>
            </div>
        </div>
    )
}
