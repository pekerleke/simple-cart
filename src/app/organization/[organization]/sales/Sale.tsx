import React, { useContext } from 'react'
import dayjs from 'dayjs';
import { Sale as SaleModel } from '@/models/Sale'
import { Product } from '@/models/Product';
import { MdMoreVert } from 'react-icons/md';
import { TooltipMenu } from '@/components/tooltip-menu/TooltipMenu';
import useModal from '@/hooks/useModal';
import { DeleteSale } from '@/components/modal-content/delete-sale/DeleteSale';
import { SalesContext } from '@/providers/SalesProvider';
import { useTranslation } from 'react-i18next';

import styles from "./sale.module.scss";

interface Props {
    sale: SaleModel
}

export const Sale = (props: Props) => {
    const { sale } = props;

    const { Modal, setModal, hideModal } = useModal();

    const { salesRefetch } = useContext(SalesContext);

    const { t: translate } = useTranslation();

    return (
        <>
            <div className={styles.sale}>
                <div className={styles.saleTitle}>
                    <div className={styles.productQuantity}>{sale.products.length} {sale.products.length === 1 ? translate("product").toLowerCase() : translate("products").toLowerCase()}</div>
                    <div className={styles.leftTitle}>
                        <div>{dayjs(sale.created_at).format('DD/MM/YYYY - HH:mm')}</div>
                        <TooltipMenu
                            menuItems={[
                                {
                                    label: translate("deleteSale"),
                                    color: "red",
                                    action: () => setModal(<DeleteSale sale={sale} onCancel={hideModal} onSuccess={() => {salesRefetch(); hideModal();}} />, translate("deleteSale"))
                                }
                            ]}
                        >
                            <MdMoreVert />
                        </TooltipMenu>
                    </div>
                </div>
                <div className={styles.products}>
                    {sale.products.map((product: Product, index: number) => (
                        <div key={index} className={styles.product}>
                            <div>{product.name}</div>
                            <div>${product.price?.toLocaleString('es-AR')}</div>
                        </div>
                    ))}
                </div>
                <div className={styles.total}>
                    <div>{translate("total")}</div>
                    <div>${sale.products.reduce((accumulator: number, saleProduct: Product) => accumulator + ((saleProduct as any).price || 0), 0).toLocaleString('es-AR')}</div>
                </div>
            </div>
            <Modal />
        </>
    )
}
