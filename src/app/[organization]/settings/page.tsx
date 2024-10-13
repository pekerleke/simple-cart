"use client"

import useModal from '@/app/hooks/useModal';
import { CreateOrEditProduct } from '@/components/modal-content/CreateOrEditProduct';
import { DeleteProduct } from '@/components/modal-content/DeleteProduct';
import { Product } from '@/models/Product';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from 'rsuite';

import styles from "./styles.module.scss";

export default function Settings() {
    const params = useParams();
    const organization = params.organization;

    const [products, setProducts] = useState<any>()

    const { Modal, setModal, hideModal } = useModal();


    const getProducts = async () => {
        // setProducts(JSON.parse(localStorage.getItem("products") || "[]"));
        const response = await fetch(`/api/products?organization=${organization}`);
        const { data, error } = await response.json();
        console.log(data);

        setProducts(data);
    }

    useEffect(() => {
        getProducts();
    }, [])

    console.log(organization);

    return (
        <>
            <div>
                <h3>Settings for {organization}</h3>
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
                                                product={product}
                                                organizationId={organization as string}
                                            />, "Product"
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

                <Button block onClick={() => setModal(<CreateOrEditProduct organizationId={organization as string} onSubmit={() => { getProducts(); hideModal() }} />)}>Add Product</Button>
            </div>
            <Modal />
        </>
    );
}