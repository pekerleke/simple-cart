"use client"

import React, { useEffect, useState } from 'react'
import { Button } from 'rsuite';
import { toast } from 'react-toastify';
import { Product } from '@/models/Product';

import styles from "./cart.module.scss";

export const Cart = () => {

    const [products, setProducts] = useState<any>()
    const [loading, setLoading] = useState(true);

    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

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
        if (!localStorage.getItem("products")) {
            localStorage.setItem("products", JSON.stringify([{ name: "Demo product", price: "99" }]))
        }

        getProducts();
    }, [])

    useEffect(() => {
        const fetchProducts = async () => {
            const response = await fetch('/api/products/getProducts');
            const data = await response.json();

            console.log(data);
            // setProducts(data.products);
        };

        fetchProducts();
    }, []);

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
                    products?.sort((a: Product, b: Product) => a.priority > b.priority ? 1 : -1).map((product: Product, index: number) => (
                        <div key={index} className={styles.product} onClick={() => setSelectedProducts((prev) => [...prev, product])}>
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

                        <b>Total: ${selectedProducts.reduce((accumulator: number, product: Product) => accumulator + product.price, 0).toLocaleString('es-AR')} | {selectedProducts.length} items</b>

                        <br />
                        <br />
                        <div>
                            <Button color="green" size='lg' appearance="primary" block onClick={handleSubmit}>Submit</Button>
                        </div>
                    </div>
                )
            }
            <div>

            </div>
        </div>
    )
}
