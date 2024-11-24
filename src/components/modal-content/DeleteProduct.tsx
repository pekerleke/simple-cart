import React, { useState } from 'react'
import { Button, Message } from 'rsuite';
import { toast } from 'react-toastify';
import { Product } from '@/models/Product';
import { isDemo } from '@/utils/demo';
import { Trans, useTranslation } from 'react-i18next';

import styles from "./deleteProduct.module.scss";

interface Props {
    onDelete: () => void
    onCancel: () => void
    product: Product
}

export const DeleteProduct = (props: Props) => {
    const { product, onDelete, onCancel } = props;

    const [isLoading, setIsLoading] = useState(false);

    const { t: translate } = useTranslation();

    const handleDelete = async () => {
        if (isDemo()) {
            // TODO: refactor this
            const demoOrganizations = JSON.parse(localStorage.getItem("demoOrganizations") || "[]");
            const organization = demoOrganizations.find((organization: any) => organization.products?.find((organizationProduct: any) => organizationProduct.id === product.id));
            const products = organization.products.filter((organizationProduct: any) => organizationProduct.id !== product.id);
            organization.products = products;
            localStorage.setItem("demoOrganizations", JSON.stringify(demoOrganizations));
        } else {   
            setIsLoading(true);
            await fetch('/api/products', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: product.id }),
            }).finally(() => setIsLoading(true));
        }
        toast.success("Removed!");
        onDelete();
    }

    return (
        <div>
            <Message type="warning">
                <Trans
                    i18nKey="removeProduct.advice"
                    components={{
                        strong: <strong />
                    }}
                    values={{ name: product.name }}
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
