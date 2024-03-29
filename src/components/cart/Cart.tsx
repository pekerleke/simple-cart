"use client"

import React, { useEffect, useState } from 'react'

import styles from "./cart.module.scss";
import { Button } from 'rsuite';
import { toast } from 'react-toastify';

export const Cart = () => {

    const [products, setProducts] = useState<any>()
    const [loading, setLoading] = useState(true);

    const [selectedProducts, setSelectedProducts] = useState<any>([]);

    const handleRemoveProduct = (index: number) => {
        const tempProducts = [...selectedProducts];
        tempProducts.splice(index, 1);
        setSelectedProducts(tempProducts);
    }

    const handleSubmit = () => {
        const sales = JSON.parse(localStorage.getItem("sales") || "[]");
        localStorage.setItem("sales", JSON.stringify([...sales, {
            date: new Date(),
            products: selectedProducts
        }]))
        toast.success("Saved sale");
        setSelectedProducts([]);
    }

    const getProducts = () => {
        setProducts(JSON.parse(localStorage.getItem("products") || "[]"));
        setLoading(false);
    }

    useEffect(() => {
        console.log(localStorage.getItem("products"));
        if (!localStorage.getItem("products")) {
            console.log("setDemo");
            localStorage.setItem("products", JSON.stringify([{ name: "Demo product", price: "99" }]))
        }

        getProducts();
    }, [])

    return (
        <div>
            {
                loading && <div className={styles.skeleton}>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            }
            <div className={styles.productList}>
                {
                    !loading && !products.length && <div>There are no products.</div>
                }

                {
                    products?.sort((a: any, b: any) => a.priority > b.priority ? 1 : -1).map((product: any) => (
                        <div key={product.id} className={styles.product} onClick={() => setSelectedProducts((prev: any) => [...prev, product])}>
                            <div className={styles.info}>
                                <div className={styles.name}>{product.name}</div>
                                <div className={styles.price}>${product.price}</div>
                            </div>
                        </div>
                    ))
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
                                selectedProducts.map((product: any, index: number) => (
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

                        <div>Total: ${selectedProducts.reduce((accumulator: number, producto: any) => accumulator + parseInt(producto.price), 0).toLocaleString('es-AR')} | {selectedProducts.length} items</div>

                        <br />
                        <div>
                            <Button color="green" appearance="primary" block onClick={handleSubmit}>Submit</Button>
                        </div>
                    </div>
                )
            }
            <div>

            </div>
        </div>
    )
}
