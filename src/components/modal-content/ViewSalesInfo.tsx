import React from 'react'

import styles from "./viewSalesInfo.module.scss";
import { Product } from '@/models/Product';

interface Props {
    salesInfo: {
        created_at: string,
        products: Product[]
    }[]
}

interface Resume {
    products: {
        [name: string]: {
            quantity: number
            totalAmount: number
        }
    },
    totalAmount: number
}

interface ProductResume {
    [name: string]: {
        quantity: number
        totalAmount: number

    }
}

export const ViewSalesInfo = (props: Props) => {
    const { salesInfo } = props;

    const products = salesInfo.reduce((acc: Product[], item) => { acc.push(...item.products); return acc; }, [])

    const resume: Resume = products.reduce((acc, item) => {
        acc["totalAmount"] += item.price;
        acc["products"][item.name] = {
            quantity: (acc["products"][item.name]?.quantity || 0) + 1,
            totalAmount: (acc["products"][item.name]?.totalAmount || 0) + item.price,
        };
        return acc;
    }, {
        totalAmount: 0,
        products: {} as ProductResume
    })

    return (
        <div>
            {Object.keys(resume.products).map(resumeKey => (
                <div key={resumeKey} className={styles.saleRow}>
                    <div>{resumeKey} x {resume.products[resumeKey].quantity}</div>
                    <div>${resume.products[resumeKey].totalAmount.toLocaleString('es-AR')}</div>
                </div>
            ))}

            <hr />

            <b>Sales:</b> {salesInfo.length} <br />
            <b>Sold products:</b> {products.length} <br />
            <b>Total amount:</b> ${resume.totalAmount.toLocaleString('es-AR')}
        </div>
    )
}
