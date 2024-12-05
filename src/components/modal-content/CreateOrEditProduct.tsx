import React, { useEffect, useState } from 'react'
import { Button, Input } from 'rsuite';
import { Product } from '@/models/Product';
import { v4 as uuidv4 } from 'uuid';
import { isDemo } from '@/utils/demo';
import { useTranslation } from 'react-i18next';

import styles from "./createOrEditProduct.module.scss";
import classNames from 'classnames';

interface Props {
    product?: Product
    organizationId?: string
    onSubmit: () => void
}

export const CreateOrEditProduct = (props: Props) => {

    const { product, organizationId, onSubmit } = props;

    const [isLoading, setIsLoading] = useState(false);
    const [dbColors, setDbColors] = useState([]);

    const [values, setValues] = useState<Product>({
        id: product?.id || "",
        name: product?.name || "",
        price: product?.price,
        priority: product?.priority,
        colors_id: product?.colors_id || 1
    });

    console.log(product);

    const { t: translate } = useTranslation();

    const getColors = async () => {
        const colors = await fetch('/api/colors').then((res) => res.json())
        setDbColors(colors.data);
        console.log(colors.data);
    }

    useEffect(() => {
        getColors();
    }, [])


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
                body: JSON.stringify({ id: values.id, name: values.name, price: values.price || 0, priority: values.priority || 0, colors_id: values.colors_id }),
            }).then((res) => res.json())
                .finally(() => setIsLoading(false));
        }
        onSubmit();
    }

    return (
        <div className={styles.container}>
            <div>
                <b>{translate("name")}</b>
                <Input placeholder={translate("productName.placeholder")} value={values.name} onChange={(value) => setValues(prev => ({ ...prev, name: value }))} />
            </div>

            <div>
                <b>{translate("price")}</b>
                <Input placeholder={translate("productPrice.placeholder")} type='number' value={values.price} onChange={(value) => setValues(prev => ({ ...prev, price: parseInt(value) }))} />
            </div>

            <div>
                <b>{translate("priority")}</b>
                <Input placeholder={translate("productPriority.placeholder")} type='number' value={values.priority} onChange={(value) => setValues(prev => ({ ...prev, priority: parseInt(value) }))} />
            </div>

            <div>
                <b>Color</b>
                <div className={styles.colorsSelector}>
                    {
                        dbColors.sort((a: any, b: any) => a.id > b.id ? 1 : -1).map((color: any) => (
                            <div
                                className={classNames(styles.colorItem, { [styles.selected]: values.colors_id === color.id })}
                                style={{
                                    backgroundColor: color.primary,
                                    borderColor: color.secondary,
                                    ...(values.colors_id === color.id && { boxShadow: `0 0 0 3px ${color.tertiary}` })
                                }}
                                onClick={() => setValues(prev => ({ ...prev, colors_id: color.id }))}
                            />
                        ))
                    }
                    {
                        !dbColors.length && (
                            <>
                                <div className={styles.colorItem} />
                                <div className={styles.colorItem} />
                                <div className={styles.colorItem} />
                                <div className={styles.colorItem} />
                                <div className={styles.colorItem} />
                            </>
                        )
                    }
                </div>
            </div>

            <br />

            <Button loading={isLoading} disabled={isLoading} onClick={() => handleSubmit()}><b>{translate("save")}</b></Button>
        </div>
    )
}
