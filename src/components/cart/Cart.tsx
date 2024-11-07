"use client"

import React, { useContext, useState } from 'react'
import { Button } from 'rsuite';
import { toast } from 'react-toastify';
import { Product } from '@/models/Product';
import Link from 'next/link';
import { OrganizationContext } from '@/providers/OrganizationProvider';
import { useParams } from 'next/navigation';
import { AuthContext } from '@/providers/AuthProvider';
import { v4 as uuidv4 } from 'uuid';
import { EmptyAdvice } from '../empty-advice/EmptyAdvice';

import styles from "./cart.module.scss";

export const Cart = () => {

    const { organization: organizationId } = useParams();
    const { organization, status } = useContext(OrganizationContext);
    const { isDemo } = useContext(AuthContext);

    const [isLoading, setIsLoading] = useState(false);

    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

    const handleRemoveProduct = (index: number) => {
        const tempProducts = [...selectedProducts];
        tempProducts.splice(index, 1);
        setSelectedProducts(tempProducts);
    }

    const handleSubmit = async () => {

        if (isDemo) {
            const demoSales = JSON.parse(localStorage.getItem("demoSales") || "[]");

            demoSales.push({
                "id": uuidv4(),
                "created_at": new Date(),
                "products": selectedProducts,
                "user_id": "demo",
                "organization_id": organizationId
            })

            localStorage.setItem("demoSales", JSON.stringify(demoSales));
            toast.success("Saved sale");

        } else {
            setIsLoading(true);
            await fetch('/api/sales', {
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
        }

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
                    <EmptyAdvice title='There are no products'>
                        <div> Start building your collection by adding products in the <Link className={styles.link} href={`/${organizationId}/settings`}><b>Settings</b></Link> section!</div>
                    </EmptyAdvice>
                )
            }

            {
                (status === "success" && organization) && (
                    <div className={styles.productList}>
                        {
                            ((organization as any))?.products?.sort((a: Product, b: Product) => a.priority === b.priority ? (a.name > b.name ? 1 : -1) : ((a as any).priority > (b as any).priority ? 1 : -1)).map((product: Product, index: number) => {
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
