"use client"

import React, { useContext, useState } from 'react'
import { Button } from 'rsuite';
import { toast } from 'react-toastify';
import { Product } from '@/models/Product';
import Link from 'next/link';
import { OrganizationContext } from '@/providers/OrganizationProvider';
import { useParams } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { EmptyAdvice } from '../empty-advice/EmptyAdvice';
import { isDemo } from '@/utils/demo';
import { Trans, useTranslation } from 'react-i18next';

import styles from "./cart.module.scss";

export const Cart = () => {

    const { organization: organizationId } = useParams();
    const { organization, status } = useContext(OrganizationContext);

    const [isLoading, setIsLoading] = useState(false);

    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
    const [resume, setResume] = useState({
        products: {},
        total: 0
    });

    const { t: translate } = useTranslation();

    // const handleRemoveProduct = (index: number) => {
    //     const tempProducts = [...selectedProducts];
    //     tempProducts.splice(index, 1);
    //     setSelectedProducts(tempProducts);
    // }

    const handleRemoveProduct = (productId: string) => {
        const indexToRemove = selectedProducts.findIndex(product => product.id === productId);
        const tempProducts = [...selectedProducts];
        tempProducts.splice(indexToRemove, 1);
        setSelectedProducts(tempProducts);

        /////////////////////

        setResume((prevResume: any) => {
            const { products, total } = prevResume;

            const productToRemove = products[productId];
            if (!productToRemove) {
                return prevResume; // Si no existe el producto, no hacer nada
            }

            const { quantity, total: productTotal } = productToRemove;

            const updatedProducts = { ...products };

            if (quantity > 1) {
                updatedProducts[productId] = {
                    ...productToRemove,
                    quantity: quantity - 1,
                    total: productTotal - productToRemove.product.price,
                };
            } else {
                delete updatedProducts[productId];
            }

            return {
                ...prevResume,
                products: updatedProducts,
                total: total - productToRemove.product.price,
            };
        });
    }

    const handleSelectedProduct = (product: Product) => {
        setSelectedProducts((prev) => [...prev, product]);

        // const tempResume = {...resume};

        // if ((tempResume.products as any)[product.id]) {
        //     (tempResume.products as any)[product.id] = {
        //         ...(tempResume.products as any)[product.id],
        //         quantity: (tempResume.products as any)[product.id].quantity + 1,
        //         total: (tempResume.products as any)[product.id].total + product.price
        //     }
        // } else {
        //     (tempResume.products as any)[product.id] = {
        //         product,
        //         quantity: 1,
        //         total: product.price
        //     }
        // }

        // tempResume.total = tempResume.total + (product.price || 0)

        // setResume(tempResume);

        setResume((prevResume: any) => {
            const { products, total } = prevResume;

            const existingProduct = products[product.id];

            const updatedProduct = existingProduct
                ? {
                    ...existingProduct,
                    quantity: existingProduct.quantity + 1,
                    total: existingProduct.total + product.price,
                }
                : {
                    product,
                    quantity: 1,
                    total: product.price,
                };

            return {
                ...prevResume,
                products: {
                    ...products,
                    [product.id]: updatedProduct,
                },
                total: total + product.price,
            };
        });
    }

    console.log(resume);

    const handleSubmit = async () => {

        if (isDemo()) {
            const demoSales = JSON.parse(localStorage.getItem("demoSales") || "[]");

            demoSales.push({
                "id": uuidv4(),
                "created_at": new Date(),
                "products": selectedProducts,
                "user_id": "demo",
                "organization_id": organizationId
            })

            localStorage.setItem("demoSales", JSON.stringify(demoSales));
            toast.success(translate("savedSale"));

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
                toast.success(translate("savedSale"));
                return res.json()
            })
                .catch(() => toast.error(translate("error.generic")))
                .finally(() => setIsLoading(false));
        }

        setSelectedProducts([]);
    }

    console.log(selectedProducts);

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
                    <EmptyAdvice title={translate("noProducts.advice")}>
                        <Trans
                            i18nKey="noProducts.advice.content"
                            components={{
                                strong: <strong />,
                                Link: <Link href={`/organization/${organizationId}/settings`} />
                            }}
                        />
                    </EmptyAdvice>
                )
            }

            {
                (status === "success" && organization) && (
                    <div className={styles.productList}>
                        {
                            ((organization as any))?.products?.sort((a: Product, b: Product) => a.priority === b.priority ? (a.name > b.name ? 1 : -1) : ((a as any).priority > (b as any).priority ? 1 : -1)).map((product: Product, index: number) => {
                                return (
                                    <div key={index}
                                        className={styles.product}
                                        style={{
                                            backgroundColor: product.colors?.primary,
                                            color: product.colors?.secondary,
                                            borderColor: product.colors?.tertiary

                                            // backgroundColor: product.colors?.secondary,
                                            // color: "#fff",
                                        }}
                                        onClick={() => handleSelectedProduct(product)}
                                    >
                                        <div className={styles.info}>
                                            <div className={styles.name}>{product.name}</div>
                                            <div
                                                className={styles.price}
                                                style={{
                                                    color: product.colors?.secondary,
                                                    // color: "#fff",
                                                }}
                                            >
                                                ${product.price}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                )
            }

            {/* {
                Boolean(selectedProducts.length) && (
                    <div>
                        <br />
                        <div className={styles.resume}>
                            <h4>{translate("resume")}</h4>

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
                                        {translate("total")} ({selectedProducts.length} {selectedProducts.length === 1 ? translate("item") : translate("items")})
                                    </div>
                                    <div className={styles.totalAmount}>
                                        ${selectedProducts.reduce((accumulator: number, product: Product) => accumulator + (product as any).price, 0).toLocaleString('es-AR')}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <Button loading={isLoading} disabled={isLoading} color="green" size='lg' appearance="primary" block onClick={handleSubmit}><b>{translate("save")}</b></Button>
                            </div>
                        </div>
                    </div>
                )
            } */}

            {
                Boolean(Object.keys(resume.products).length) && (
                    <div>
                        <br />
                        <div className={styles.resume}>
                            <h4>{translate("resume")}</h4>

                            <div>
                                <div className={styles.productsContainer}>
                                    {/* {
                                        selectedProducts.map((product: Product, index: number) => (
                                            <div className={styles.product} key={index}>
                                                <div>{product.name}</div>
                                                <div className={styles.operations}>
                                                    <div>${product.price}</div>
                                                    <div onClick={() => handleRemoveProduct(index)}>✕</div>
                                                </div>
                                            </div>
                                        ))
                                    } */}
                                    {
                                        Object.keys(resume.products).map((key: string) => {
                                            const product = (resume.products as any)[key];
                                            return (
                                                <div className={styles.product} key={key}>
                                                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                                                        <div style={{ width: 24, height: 24, backgroundColor: "#efefef", fontWeight: 600, display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "100%" }}>
                                                            {product.quantity}
                                                        </div>
                                                        <div>{product.product.name}</div>
                                                    </div>
                                                    <div className={styles.operations}>
                                                        <div>${product.total}</div>
                                                        <div onClick={() => handleRemoveProduct(key)}>✕</div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                <br />
                                <div className={styles.totalRow}>
                                    <div>
                                        {translate("total")} ({selectedProducts.length} {selectedProducts.length === 1 ? translate("item") : translate("items")})
                                    </div>
                                    <div className={styles.totalAmount}>
                                        ${selectedProducts.reduce((accumulator: number, product: Product) => accumulator + (product as any).price, 0).toLocaleString('es-AR')}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <Button loading={isLoading} disabled={isLoading} color="green" size='lg' appearance="primary" block onClick={handleSubmit}><b>{translate("save")}</b></Button>
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
