"use client"

import useModal from '@/hooks/useModal';
import { CreateOrEditProduct } from '@/components/modal-content/CreateOrEditProduct';
import { DeleteProduct } from '@/components/modal-content/DeleteProduct';
import { Product } from '@/models/Product';
import { useContext } from 'react';
import { Button } from 'rsuite';
import { OrganizationContext } from '@/providers/OrganizationProvider';
import { InviteButton } from '@/components/invite-button/InviteButton';
import { RemoveParticipant } from '@/components/modal-content/RemoveParticipant';
import { LeaveOrganization } from '@/components/modal-content/LeaveOrganization';
import { DeleteOrganization } from '@/components/modal-content/DeleteOrganization';
import { useRouter } from 'next/navigation';
import classNames from 'classnames';
import { MdAdd, MdMoreVert } from 'react-icons/md';
import { Message } from '@/components/message/Message';
import { useSession } from 'next-auth/react';
import { isDemo } from '@/utils/demo';
import { CreateOrEditOrganization } from '@/components/modal-content/CreateOrEditOrganization';
import { TooltipMenu } from '@/components/tooltip-menu/TooltipMenu';

import styles from "./styles.module.scss";

export default function Settings() {
    const { organization, refetch } = useContext(OrganizationContext);

    const { Modal, setModal, hideModal } = useModal();

    const router = useRouter();

    const { data: session } = useSession();

    if (!organization) return null;

    return (
        <>
            <div>
                <div className={styles.card}>
                    <div className={styles.title}>Participants</div>
                    <div className={styles.participantsList}>
                        {
                            (organization as any)?.organization_participants_duplicate.map((participant: any, index: number) => (
                                <div key={index} className={styles.participant}>
                                    <div className={styles.participantInfo}>
                                        <img src={participant.users_duplicate?.avatar_url} alt={participant.users_duplicate?.full_name} />
                                        {participant.users_duplicate?.full_name}
                                    </div>

                                    {
                                        (participant.user_id !== (session?.user as any)?.id) && !isDemo() && (
                                            <TooltipMenu
                                                menuItems={[
                                                    {
                                                        label: "Delete",
                                                        color: "red",
                                                        action: () => setModal(<RemoveParticipant
                                                            onDelete={() => { refetch(); hideModal(); }}
                                                            onCancel={hideModal}
                                                            participant={participant} />, "Remove participant")
                                                    }
                                                ]}
                                            >
                                                <MdMoreVert size={18} />
                                            </TooltipMenu>
                                        )
                                    }
                                </div>
                            ))
                        }
                    </div>
                    <InviteButton disabled={isDemo()} organizationId={(organization as any)?.id} />
                </div>

                <br />

                <div className={styles.card}>
                    <div className={styles.title}>Products</div>

                    <div className={styles.productList}>
                        {
                            (organization as any)?.products_duplicate?.sort((a: any, b: any) => a.priority === b.priority ? (a.name > b.name ? 1 : -1) : (a.priority > b.priority ? 1 : -1))
                                .map((product: Product) => (
                                    <div className={styles.product} key={product.id}>
                                        <div className={styles.info}><b>{product.name}</b></div>

                                        <div style={{ display: "flex", gap: 10 }}>
                                            ${product.price}
                                            <TooltipMenu
                                                menuItems={[
                                                    {
                                                        label: "Edit",
                                                        action: () => setModal(<CreateOrEditProduct
                                                            onSubmit={() => { refetch(); hideModal(); }}
                                                            product={product}
                                                            organizationId={(organization as any)?.id as string}
                                                        />, product.name)
                                                    },
                                                    {
                                                        label: "Delete",
                                                        color: "red",
                                                        action: () => setModal(<DeleteProduct
                                                            onDelete={() => { refetch(); hideModal(); }}
                                                            onCancel={hideModal}
                                                            product={product} />, "Delete product")
                                                    }
                                                ]}
                                            >
                                                <MdMoreVert size={18} />
                                            </TooltipMenu>
                                        </div>
                                    </div>
                                ))
                        }

                        {
                            !(organization as any)?.products_duplicate.length && <Message type='info' message='No products yet' />
                        }
                    </div>

                    <Button block onClick={() => setModal(<CreateOrEditProduct organizationId={(organization as any)?.id as string} onSubmit={() => { refetch(); hideModal(); }} />, "New product")}>
                        <div className={styles.buttonText}><MdAdd /> Add Product</div>
                    </Button>

                </div>

                <br />


                <div className={styles.card}>
                    <div className={styles.title}>Organization</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                        <Button block appearance='ghost' onClick={() => setModal(<CreateOrEditOrganization organization={organization} onSubmit={() => { refetch(); hideModal(); }} />, "Leave organization")}>
                            <div className={classNames(styles.buttonText)}>Change organization name</div>
                        </Button>

                        <Button block color='red' appearance='ghost' onClick={() => setModal(<LeaveOrganization organization={organization} onCancel={hideModal} onSuccess={() => { hideModal(); router.push("/"); }} />, "Leave organization")}>
                            <div className={classNames(styles.buttonText, styles.red)}>Leave organization</div>
                        </Button>

                        <Button block color='red' appearance='ghost' onClick={() => setModal(<DeleteOrganization organization={organization} onCancel={hideModal} onSuccess={() => { hideModal(); router.push("/"); }} />, "Delete organization")}>
                            <div className={classNames(styles.buttonText, styles.red)}>Delete organization</div>
                        </Button>
                    </div>
                </div>


            </div>
            <Modal />
        </>
    );
}