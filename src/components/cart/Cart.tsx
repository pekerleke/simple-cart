"use client"

import React, { useState } from 'react'
import { Button } from 'rsuite';
import { toast } from 'react-toastify';
import { Product } from '@/models/Product';

import styles from "./cart.module.scss";
import { stringToColor } from '@/utils/stringToColor';
import Loader from '../loader/Loader';

interface Props {
    organizationId?: string,
    products: any[],
    status: string
}

export const Cart = (props: Props) => {

    const { organizationId, products, status } = props;

    const [isLoading, setIsLoading] = useState(false);

    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

    const handleRemoveProduct = (index: number) => {
        const tempProducts = [...selectedProducts];
        tempProducts.splice(index, 1);
        setSelectedProducts(tempProducts);
    }

    const handleSubmit = async () => {
        setIsLoading(true);
        const { data, error } = await fetch('/api/sales', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ products: selectedProducts, organization: organizationId }),
        }).then((res) => res.json())
        .finally(() => setIsLoading(false));

        toast.success("Saved sale");
        setSelectedProducts([]);
    }

    return (
        <div>
            {
                status === "loading" && <div className={styles.skeleton}>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            }

            <div className={styles.productList}>
                {
                    (status !== "loading") && !products?.length && <div>There are no products. Add some in <b>settings</b></div>
                }

                {
                    products?.sort((a: Product, b: Product) => a.priority === b.priority ? (a.name > b.name ? 1 : -1) : ((a as any).priority > (b as any).priority ? 1 : -1)).map((product: Product, index: number) => {
                        // const colors = stringToColor(product.name);
                        return (
                            <div key={index} className={styles.product} /*style={{backgroundColor: colors.pastel, color: colors.contrast}}*/ onClick={() => setSelectedProducts((prev) => [...prev, product])}>
                                <div className={styles.info}>
                                    <div className={styles.name}>{product.name}</div>
                                    <div className={styles.price}>${product.price}</div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>

            {
                Boolean(selectedProducts.length) && (
                    <div className={styles.resume}>
                        <br /><br />
                        <h4>Resume</h4>
                        <hr />
                        <div className={styles.productsContainer}>
                            {
                                selectedProducts.map((product: Product, index: number) => (
                                    <div className={styles.product} key={index}>
                                        <div>{product.name}</div>
                                        <div className={styles.operations}>
                                            <div>${product.price}</div>
                                            <div onClick={() => handleRemoveProduct(index)}>✕</div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>

                        <br />

                        <b>Total: ${selectedProducts.reduce((accumulator: number, product: Product) => accumulator + (product as any).price, 0).toLocaleString('es-AR')} | {selectedProducts.length} items</b>

                        <br />
                        <br />
                        <div>
                            <Button loading={isLoading} disabled={isLoading} color="green" size='lg' appearance="primary" block onClick={handleSubmit}><b>Submit</b></Button>
                        </div>
                    </div>
                )
            }
            <div>

            </div>
        </div>
    )
}
