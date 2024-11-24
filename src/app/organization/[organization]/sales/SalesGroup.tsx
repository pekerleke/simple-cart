"use client"

import React, { useState } from 'react'
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import 'dayjs/locale/pt';
import 'dayjs/locale/es';
import { FaChevronRight, FaChevronUp } from 'react-icons/fa';
import { MdOutlineCalendarMonth } from 'react-icons/md';
import { Sale as SaleModel } from '@/models/Sale';
import useModal from '@/hooks/useModal';
import { ViewSalesInfo } from '@/components/modal-content/ViewSalesInfo';
import { Sale } from './Sale';
import { useTranslation } from 'react-i18next';
import { getCookie } from '@/utils/getCookie';

import styles from "./sales.module.scss";

interface Props {
    groupKey: string;
    salesGroup: SaleModel[];
    open?: boolean;
}

export const SalesGroup = (props: Props) => {
    const { groupKey, salesGroup, open = false } = props;

    const { Modal, setModal } = useModal();

    const [show, setShow] = useState(open);

    dayjs.locale(getCookie("locale"));

    const { t: translate } = useTranslation();

    return (
        <>
            <div className={styles.container}>
                <div className={styles.titleRow}>
                    <div className={styles.titleContainer} onClick={() => setShow(prev => !prev)}>
                        <div className={styles.icon}>{show ? <FaChevronUp /> : <FaChevronRight />}</div>
                        <div className={styles.title}><MdOutlineCalendarMonth /> {dayjs(groupKey).format("ddd DD MMM")}</div>
                        <div className={styles.salesQuantity}>{salesGroup.length} {salesGroup.length > 1 ? translate("sales") : translate("sale")}</div>
                    </div>
                    <div className={styles.detailButton} onClick={() => setModal(<ViewSalesInfo salesInfo={salesGroup} />, dayjs(groupKey).format("ddd DD MMM YYYY"))}>{translate("details")}</div>
                </div>

                {
                    show && (
                        <div className={styles.salesContainer}>
                            {salesGroup.map((sale: SaleModel, index: number) => (
                                <Sale key={index} sale={sale} />
                            ))}
                        </div>
                    )
                }
            </div>

            <Modal />
        </>
    )
}
