import { useState, useEffect } from 'react';
import { BsPlusCircleFill } from 'react-icons/bs';
import { useParams } from 'react-router-dom';
import { isAxiosError } from '../../../util/helpers';
import { getStorePlans, deletePlan } from '../../../api/owner';
import Button from '../../../components/Button';
import { DeleteModal, FormDialogForPlan } from '../../../components/Dialog';
import styles from '../styles.module.scss';
import OwnerPlan from '../../../components/Plan/OwnerPlan';

export type PlanType = {
	id: number;
	planName: string;
	planAmount: number;
	price: number;
	planType: string;
};

type ConditionReturnFormDialogForPlanType = {
	isOpen: boolean;
	editingPlan?: PlanType;
	closeDialog: Function;
	handleCreate: Function;
	handleEdit: Function;
};

function ConditionReturnFormDialogForPlan({
	isOpen,
	closeDialog,
	editingPlan,
	handleCreate,
	handleEdit,
}: ConditionReturnFormDialogForPlanType) {
	if (editingPlan) {
		return (
			<FormDialogForPlan
				isOpen={isOpen}
				closeDialog={closeDialog}
				editingPlan={editingPlan}
				handleDialogSubmit={handleEdit}
				buttonText='修改方案'
			/>
		);
	} else {
		return (
			<FormDialogForPlan
				isOpen={isOpen}
				closeDialog={closeDialog}
				handleDialogSubmit={handleCreate}
				buttonText='建立方案'
			/>
		);
	}
}

export default function OwnerPlans() {
	const { storeId } = useParams();
	const [noDataMessage, setNoDataMessage] = useState<string>('');
	const [togglePlanDialog, setTogglePlanDialog] = useState<boolean>(false);
	const [toggleDeleteModal, setToggleDeleteModal] = useState<boolean>(false);
	const [editingPlan, setEditingPlan] = useState<PlanType>();
	const [planId, setPlanId] = useState<number>(0);
	const [plans, setPlans] = useState<PlanType[] | []>([]);

	useEffect(() => {
		async function fetchPlans() {
			try {
				const response = await getStorePlans(Number.parseInt(storeId as string, 10));
				if (response.status === 200) {
					const { data } = response;
					setPlans(data);
				}
			} catch (error) {
				if (isAxiosError(error)) {
					setNoDataMessage(error.response?.data.message);
				}
				console.error(error);
			}
		}

		fetchPlans();
	}, []);

	async function deletePlanById() {
		try {
			const response = await deletePlan(planId);
			if (response.status === 200) {
				setPlans(plans.filter((plan) => plan.id !== planId));
				setToggleDeleteModal(false);
			}
		} catch (error) {
			console.error(error);
		}
	}

	async function createPlanIntoStore(data) {
		console.log(data);
	}

	async function updatePlanIntoStore(data) {
		console.log(data);
	}

	return (
		<>
			<Button
				type='button'
				className={styles.btn__open}
				onClick={() => setTogglePlanDialog(!togglePlanDialog)}
			>
				<BsPlusCircleFill />
			</Button>
			<section className={styles.section}>
				{noDataMessage ? (
					<p className={styles.noData}>{noDataMessage}</p>
				) : (
					<ul className={styles.plans}>
						{plans.map((plan) => (
							<OwnerPlan
								key={plan.id}
								plan={plan}
								openDeleteModal={() => {
									setPlanId(plan.id);
									setToggleDeleteModal(!toggleDeleteModal);
								}}
								openEditDialog={() => {
									setEditingPlan(plan);
									setTogglePlanDialog(!togglePlanDialog);
								}}
							/>
						))}
					</ul>
				)}
			</section>
			<DeleteModal
				isOpen={toggleDeleteModal}
				closeDialog={() => setToggleDeleteModal(false)}
				handleDelete={() => deletePlanById()}
			/>
			<ConditionReturnFormDialogForPlan
				isOpen={togglePlanDialog}
				closeDialog={() => {
					setTogglePlanDialog(!togglePlanDialog);
					setEditingPlan(undefined);
				}}
				editingPlan={editingPlan}
				handleCreate={createPlanIntoStore}
				handleEdit={updatePlanIntoStore}
			/>
		</>
	);
}
