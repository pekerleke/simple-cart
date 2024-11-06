"use client"

import useModal from '@/app/hooks/useModal';
import { CreateOrEditProduct } from '@/components/modal-content/CreateOrEditProduct';
import { DeleteProduct } from '@/components/modal-content/DeleteProduct';
import { Product } from '@/models/Product';
import { useContext } from 'react';
import { Button } from 'rsuite';
import { OrganizationContext } from '@/providers/OrganizationProvider';
import { InviteButton } from '@/components/invite-button/InviteButton';
import { AuthContext } from '@/providers/AuthProvider';
import { RemoveParticipant } from '@/components/modal-content/RemoveParticipant';
import { LeaveOrganization } from '@/components/modal-content/LeaveOrganization';
import { DeleteOrganization } from '@/components/modal-content/DeleteOrganization';
import { useRouter } from 'next/navigation';

import styles from "./styles.module.scss";
import classNames from 'classnames';
import { MdAdd } from 'react-icons/md';
import { Message } from '@/components/message/Message';

export default function Settings() {
    const { organization, refetch } = useContext(OrganizationContext);
    const { user } = useContext(AuthContext);

    const { Modal, setModal, hideModal } = useModal();

    const router = useRouter();

    if (!organization) return null;

    return (
        <>
            <div>
                <div className={styles.card}>
                    <div className={styles.title}>Participants</div>
                    <div className={styles.participantsList}>
                        {
                            (organization as any)?.organization_participants.map((participant: any, index: number) => (
                                <div key={index} className={styles.participant}>
                                    <div className={styles.participantInfo}>
                                        <img src={participant.users?.avatar_url} alt={participant.users?.full_name} />
                                        {participant.users?.full_name}
                                    </div>
                                    <div className={styles.operations}>
                                        {
                                            (participant.user_id !== (user as any)?.id) && (
                                                <Button
                                                    appearance="subtle"
                                                    onClick={() => setModal(
                                                        <RemoveParticipant
                                                            onDelete={() => { refetch(); hideModal(); }}
                                                            onCancel={hideModal}
                                                            participant={participant} />,
                                                        "Remove participant"
                                                    )}
                                                >
                                                    <div className={classNames(styles.buttonText, styles.red)}>Remove</div>
                                                </Button>
                                            )
                                        }
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    <InviteButton organizationId={(organization as any)?.id} />
                </div>

                <br />

                <div className={styles.card}>
                    <div className={styles.title}>Products</div>

                    <div className={styles.productList}>
                        {
                            (organization as any)?.products?.sort((a: any, b: any) => a.priority === b.priority ? (a.name > b.name ? 1 : -1) : (a.priority > b.priority ? 1 : -1))
                                .map((product: Product) => (
                                    <div className={styles.product} key={product.id}>
                                        <div className={styles.info}><b>{product.name}</b> - ${product.price}</div>
                                        <div className={styles.operations}>
                                            <Button
                                                appearance="subtle"
                                                onClick={() => setModal(
                                                    <CreateOrEditProduct
                                                        onSubmit={() => { refetch(); hideModal(); }}
                                                        product={product}
                                                        organizationId={(organization as any)?.id as string}
                                                    />, product.name
                                                )}
                                            >
                                                <div className={styles.buttonText}>Edit</div>
                                            </Button>

                                            <Button
                                                appearance="subtle"
                                                onClick={() => setModal(
                                                    <DeleteProduct
                                                        onDelete={() => { refetch(); hideModal(); }}
                                                        onCancel={hideModal}
                                                        product={product} />,
                                                    "Delete product"
                                                )}
                                            >
                                                <div className={classNames(styles.buttonText, styles.red)}>Remove</div>
                                            </Button>
                                        </div>
                                    </div>
                                ))
                        }

                        {
                            !(organization as any)?.products.lenght && <Message type='info' message='No products yet' />
                        }
                    </div>

                    <Button block onClick={() => setModal(<CreateOrEditProduct organizationId={(organization as any)?.id as string} onSubmit={() => { refetch(); hideModal(); }} />, "New product")}>
                        <div className={styles.buttonText}><MdAdd /> Add Product</div>
                    </Button>

                </div>

                <br />


                <div className={styles.card}>
                    <div className={styles.title}>Organization</div>
                    <div style={{display: "flex", flexDirection: "column", gap: 5}}>
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