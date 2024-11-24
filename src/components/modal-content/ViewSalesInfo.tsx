import React from 'react'
import { Product } from '@/models/Product';
import { useTranslation } from 'react-i18next';
// import dynamic from 'next/dynamic';
// import { Sale } from '@/models/Sale';

// const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

import styles from "./viewSalesInfo.module.scss";

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

    const { t: translate } = useTranslation();

    const resume: Resume = products.reduce((acc, item) => {
        acc["totalAmount"] += (item as any).price || 0;
        acc["products"][item.name] = {
            quantity: (acc["products"][item.name]?.quantity || 0) + 1,
            totalAmount: (acc["products"][item.name]?.totalAmount || 0) + (item.price || 0),
        };
        return acc;
    }, {
        totalAmount: 0,
        products: {} as ProductResume
    })


    // const processQuantitiesForPieChart = (data: Sale[]) => {
    //     const productCounts: Record<string, number> = {};

    //     data.forEach((entry) => {
    //         entry.products.forEach((product) => {
    //             productCounts[product.name] = (productCounts[product.name] || 0) + 1;
    //         });
    //     });

    //     const labels = Object.keys(productCounts);
    //     const series = Object.values(productCounts);

    //     return { labels, series };
    // };

    // const processSalesForBarChart = (data: Sale[]) => {
    //     const productTotals: Record<string, number> = {};

    //     data.forEach((entry) => {
    //         entry.products.forEach((product) => {
    //             productTotals[product.name] = (productTotals[product.name] || 0) + (product.price || 0);
    //         });
    //     });

    //     const labels = Object.keys(productTotals).map(productKey => `${productKey}`);
    //     const series = Object.values(productTotals);

    //     return { labels, series };
    // };

    // const { labels: amountLabels, series: amountSeries } = processSalesForBarChart(salesInfo);
    // const { labels: quanityLabels, series: quiantitySeries } = processQuantitiesForPieChart(salesInfo);

    return (
        <div>
            {Object.keys(resume.products).sort((a, b) => resume.products[a].totalAmount > resume.products[b].totalAmount ? -1 : 1).map(resumeKey => (
                <div key={resumeKey} className={styles.saleRow}>
                    <div>{resumeKey} x {resume.products[resumeKey].quantity}</div>
                    <div>${resume.products[resumeKey].totalAmount.toLocaleString('es-AR')}</div>
                </div>
            ))}

            <hr />

            <b>{translate("sales")}:</b> {salesInfo.length} <br />
            <b>{translate("soldProducts")}:</b> {products.length} <br />
            <b>{translate("totalAmount")}:</b> ${resume.totalAmount.toLocaleString('es-AR')}

            {/* TODO: reimplementar */}
            {/* <hr />
            <Chart
                options={{
                    chart: {
                        type: 'bar',
                    },
                    plotOptions: {
                        bar: {
                            horizontal: true
                        },
                    },
                    xaxis: {
                        categories: amountLabels,
                        title: {
                            text: 'Total Sales ($)',
                        },
                    },
                    legend: {
                        position: 'bottom',
                    },
                }}
                series={[{ name: 'Total Sales', data: amountSeries }]}
                type="bar"
            />

            <Chart
                options={{
                    labels: quanityLabels,
                    legend: {
                        position: 'bottom',
                    },
                }}
                series={quiantitySeries}
                type="pie"
            /> */}
        </div>
    )
}
