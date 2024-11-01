"use client"

import React, { useContext, useState } from 'react'
import { Button } from 'rsuite';
import { toast } from 'react-toastify';
import { Product } from '@/models/Product';
import { Message } from '../message/Message';
import Link from 'next/link';

import styles from "./cart.module.scss";
import { useParams } from 'next/navigation';
import { OrganizationContext } from '@/providers/OrganizationProvider';

// interface Props {
//     organizationId?: string,
//     products: any[],
//     status: string
// }

export const Cart = () => {

    const { organization: organizationId } = useParams();
    const { organization, status } = useContext(OrganizationContext);


    // const { products, status } = props;


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
        }).then((res) => {
            { if (res.status !== 200) throw new Error("Something went wrong") }
            toast.success("Saved sale");
            return res.json()
        })
            .catch(() => toast.error("Ups, something went wrong"))
            .finally(() => setIsLoading(false));

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

            {
                (status !== "loading") && !(organization as any)?.products?.length && (
                    <Message type='info'>
                        <div>
                            There are no products. Add some in <Link className={styles.link} href={`/${organizationId}/settings`}><b>Settings</b></Link>
                        </div>
                    </Message>
                )
            }

            {
                (status === "success" && organization) && (
                    <div className={styles.productList}>
                        {
                            ((organization as any))?.products.sort((a: Product, b: Product) => a.priority === b.priority ? (a.name > b.name ? 1 : -1) : ((a as any).priority > (b as any).priority ? 1 : -1)).map((product: Product, index: number) => {
                                return (
                                    <div key={index} className={styles.product} onClick={() => setSelectedProducts((prev) => [...prev, product])}>
                                        <div className={styles.info}>
                                            <div className={styles.name}>{product.name}</div>
                                            <div className={styles.price}>${product.price}</div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                )
            }

            {
                Boolean(selectedProducts.length) && (

                    <div>
                        <br />
                        <div className={styles.resume}>
                            <h4>Resume</h4>

                            <div>
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
                                <div className={styles.totalRow}>
                                    <div>
                                        Total ({selectedProducts.length} items)
                                    </div>
                                    <div className={styles.totalAmount}>
                                        ${selectedProducts.reduce((accumulator: number, product: Product) => accumulator + (product as any).price, 0).toLocaleString('es-AR')}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <Button loading={isLoading} disabled={isLoading} color="green" size='lg' appearance="primary" block onClick={handleSubmit}><b>Submit</b></Button>
                            </div>
                        </div>
                    </div>
                )
            }
            <div>

            </div>
        </div>
    )
}
