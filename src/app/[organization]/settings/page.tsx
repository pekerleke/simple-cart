"use client"

import useModal from '@/app/hooks/useModal';
import { CreateOrEditProduct } from '@/components/modal-content/CreateOrEditProduct';
import { DeleteProduct } from '@/components/modal-content/DeleteProduct';
import { Product } from '@/models/Product';
import { useParams } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { Button } from 'rsuite';

import styles from "./styles.module.scss";
import { OrganizationContext } from '@/providers/OrganizationProvider';

export default function Settings() {
    // const params = useParams();
    // const organization = params.organization;

    const { organization, refetch } = useContext(OrganizationContext);

    // const [products, setProducts] = useState<any>()

    const { Modal, setModal, hideModal } = useModal();


    // const getProducts = async () => {
    //     // setProducts(JSON.parse(localStorage.getItem("products") || "[]"));
    //     const response = await fetch(`/api/products?organization=${organization}`);
    //     const { data, error } = await response.json();
    //     console.log(data);

    //     setProducts(data);
    // }

    // useEffect(() => {
    //     getProducts();
    // }, [])

    if (!organization) return null;

    return (
        <>
            <div>
                {/* <h3>Settings for {organization}</h3>
                <br />
                <h6>Products ({products?.length || 0})</h6>
                <br /> */}

                <b>Products</b>

                <div className={styles.productList}>
                    {
                        (organization as any)?.products?.sort((a: any, b: any) => a.priority === b.priority ? (a.name > b.name ? 1 : -1) : (a.priority > b.priority ? 1 : -1))
                            .map((product: Product) => (
                            <div className={styles.product} key={product.id}>
                                <div className={styles.info}><b>{product.name}</b> - ${product.price}</div>
                                <div className={styles.operations}>
                                    <Button
                                        onClick={() => setModal(
                                            <CreateOrEditProduct
                                                onSubmit={() => { refetch(); hideModal(); }}
                                                product={product}
                                                organizationId={(organization as any)?.id as string}
                                            />, "Product"
                                        )}
                                    >
                                        Edit
                                    </Button>

                                    <Button
                                        onClick={() => setModal(
                                            <DeleteProduct
                                                onDelete={() => { refetch(); hideModal(); }}
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

                <Button block onClick={() => setModal(<CreateOrEditProduct organizationId={(organization as any)?.id as string} onSubmit={() => { /*getProducts();*/ refetch(); hideModal(); }} />)}>Add Product</Button>
            </div>
            <Modal />
        </>
    );
}