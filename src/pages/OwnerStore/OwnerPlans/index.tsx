import { useState, useEffect } from 'react';
import { BsPlusCircleFill } from 'react-icons/bs';
import { useParams } from 'react-router-dom';
import { FieldValues, UseFormReset } from 'react-hook-form';
import { isAxiosError } from '../../../util/helpers';
import { getStorePlans, deletePlan, createPlan, updatePlan } from '../../../api/owner';
import Button from '../../../components/Button';
import { DeleteModal, FormDialogForPlan } from '../../../components/Dialog';
import OwnerPlan from '../../../components/Plan/OwnerPlan';
import Loading from '../../../components/Loading';
import styles from '../styles.module.scss';

export type PlanType = {
	id?: number;
	planName: string;
	planAmount: number;
	price: number;
	planType: string;
};

export default function OwnerPlans() {
	const { storeId } = useParams();
	const [noDataMessage, setNoDataMessage] = useState<string>('');
	const [togglePlanDialog, setTogglePlanDialog] = useState<boolean>(false);
	const [toggleDeleteModal, setToggleDeleteModal] = useState<boolean>(false);
	const [editingPlan, setEditingPlan] = useState<PlanType>();
	const [planId, setPlanId] = useState<number>(0);
	const [plans, setPlans] = useState<PlanType[] | []>([]);
	const [isPending, setIsPending] = useState(false);

	useEffect(() => {
		async function fetchPlans() {
			try {
				setIsPending(true);
				const response = await getStorePlans(Number.parseInt(storeId as string, 10));
				if (response.status === 200) {
					const { data } = response;
					setPlans(data);
				}
			} catch (error) {
				if (isAxiosError(error)) {
					setNoDataMessage(error.response?.data.message);
				} else {
					console.error(error);
				}
			} finally {
				setIsPending(false);
			}
		}

		fetchPlans();
	}, [storeId]);

	async function deletePlanById() {
		try {
			const response = await deletePlan(planId);
			if (response.status === 200) {
				const newPlans = plans.filter((plan) => plan.id !== planId);
				setPlans(newPlans);
				if (!newPlans.length) {
					setNoDataMessage('場館無方案');
				}
				setToggleDeleteModal(false);
			}
		} catch (error) {
			console.error(error);
		}
	}

	async function createPlanIntoStore(data: PlanType, reset: UseFormReset<FieldValues>) {
		try {
			const response = await createPlan(Number.parseInt(storeId as string, 10), data);
			if (response.status === 200) {
				if (plans.length) {
					const newPlans = [...plans, { ...data, id: response.data.id }].sort(
						(a, b) => a.price - b.price,
					);
					setPlans(newPlans);
				} else {
					setPlans([{ ...data, id: response.data.id }]);
					setNoDataMessage('');
				}
				setTogglePlanDialog(!togglePlanDialog);
				reset();
			}
		} catch (error) {
			if (isAxiosError(error)) {
				console.error(error);
			} else {
				console.error(error);
			}
		}
	}

	async function updatePlanIntoStore(data: PlanType) {
		try {
			const response = await updatePlan({ ...data, id: editingPlan?.id });
			if (response.status === 200) {
				const newPlans = plans
					.map((plan) => {
						if (plan.id === editingPlan?.id) {
							return { ...plan, ...data };
						} else return plan;
					})
					.sort((a, b) => a.price - b.price);
				setPlans(newPlans);
				setTogglePlanDialog(!togglePlanDialog);
				setEditingPlan(undefined);
			}
		} catch (error) {
			if (isAxiosError(error)) {
				console.error(error);
			} else {
				console.error(error);
			}
		}
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
				{isPending ? (
					<Loading />
				) : noDataMessage ? (
					<p className={styles.noData}>{noDataMessage}</p>
				) : (
					<ul className={styles.plans}>
						{plans.map((plan) => (
							<OwnerPlan
								key={plan.id}
								plan={plan}
								openDeleteModal={() => {
									setPlanId(plan?.id as number);
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
			<FormDialogForPlan
				isOpen={togglePlanDialog}
				closeDialog={() => {
					setTogglePlanDialog(!togglePlanDialog);
					setEditingPlan(undefined);
				}}
				editingPlan={editingPlan}
				handleDialogSubmit={editingPlan ? updatePlanIntoStore : createPlanIntoStore}
				buttonText={editingPlan ? '修改方案' : '建立方案'}
			/>
		</>
	);
}
