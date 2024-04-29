'use client'

import { useEffect, useState } from "react";
import useModal from "../hooks/useModal";
import { CreateOrEditProduct } from "@/components/modal-content/CreateOrEditProduct";
import { Button } from "rsuite";
import { DeleteProduct } from "@/components/modal-content/DeleteProduct";
import { Product } from "@/models/Product";

import styles from "./settings.module.scss";

const Settings = () => {

    const [products, setProducts] = useState<any>()

    const { Modal, setModal, hideModal } = useModal();


    const getProducts = () => {
        setProducts(JSON.parse(localStorage.getItem("products") || "[]"));
    }

    useEffect(() => {
        getProducts();
    }, [])

    return (
        <>
            <div>
                <h3>Settings</h3>
                <br />
                <h6>Products ({products?.length || 0})</h6>
                <br />

                <div className={styles.productList}>
                    {
                        products?.map((product: Product) => (
                            <div className={styles.product} key={product.id}>
                                <div className={styles.info}>{product.name} - ${product.price}</div>
                                <div className={styles.operations}>
                                    <Button
                                        onClick={() => setModal(
                                            <CreateOrEditProduct
                                                onSubmit={() => { getProducts(); hideModal() }}
                                                product={product} />, "Product"
                                        )}
                                    >
                                        Edit
                                    </Button>

                                    <Button
                                        onClick={() => setModal(
                                            <DeleteProduct
                                                onDelete={() => { getProducts(); hideModal() }}
                                                onCancel={hideModal}
                                                product={product} />
                                        )}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        ))
                    }
                </div>

                <br />

                <Button block onClick={() => setModal(<CreateOrEditProduct onSubmit={() => { getProducts(); hideModal() }} />)}>Add Product</Button>
            </div>
            <Modal />
        </>
    )
}

export default Settings;