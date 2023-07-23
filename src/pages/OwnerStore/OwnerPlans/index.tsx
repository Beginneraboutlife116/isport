// import { useState, useEffect } from 'react';
// import { BsPlusCircleFill } from 'react-icons/bs';
// import Button from '../../../components/Button';
// import { DeleteModal, FormDialogForPlan } from '../../../components/Dialog';
// import styles from './styles.module.scss';

export type PlanType = {
	id: number;
	planName: string;
	planAmount: number;
	price: number;
	planType: string;
};

// type ConditionReturnFormDialogForPlanType = {
// 	isOpen: boolean;
// 	editingPlan?: PlanType;
// 	closeDialog: Function;
// 	handleCreate: Function;
// 	handleEdit: Function;
// };

// function ConditionReturnFormDialogForPlan({
// 	isOpen,
// 	closeDialog,
// 	editingPlan,
// 	handleCreate,
// 	handleEdit,
// }: ConditionReturnFormDialogForPlanType) {}

// export default function OwnerPlans() {
// 	const [noDataMessage, setNoDataMessage] = useState<string>('');
// 	const [togglePlanDialog, setTogglePlanDialog] = useState<boolean>(false);
// 	const [toggleDeleteModal, setToggleDeleteModal] = useState<boolean>(false);
// 	const [editingPlan, setEditingPlan] = useState<PlanType>();
// 	const [plans, setPlans] = useState<PlanType[]>();

// 	return (
// 		<>
// 			<Button
// 				type='button'
// 				className={styles.btn__open}
// 				onClick={() => setTogglePlanDialog(!togglePlanDialog)}
// 			>
// 				<BsPlusCircleFill />
// 			</Button>
// 			<section style={{ overflowY: 'scroll' }}>
// 				{noDataMessage ? (
// 					<p className={styles.noData}>{noDataMessage}</p>
// 				) : (
// 					// Object.entries(eachDayClasses).map(([key, value]) => (
// 					// 	<OwnerClass
// 					// 		key={key}
// 					// 		eachDayClasses={value}
// 					// 		weekday={key}
// 					// 		openDeleteModal={(id: number) => {
// 					// 			setToggleDeleteModal(true);
// 					// 			setClassIdAndDay([id, key]);
// 					// 		}}
// 					// 		openEditDialog={(id: number) => {
// 					// 			setToggleClassDialog(true);
// 					// 			setEditingClass({
// 					// 				...eachDayClasses[key].find((data) => data.id === id),
// 					// 				weekDay: Number.parseInt(key, 10),
// 					// 			} as ClassType);
// 					// 		}}
// 					// 	/>
// 					// ))
// 					<div>Test</div>
// 				)}
// 			</section>
// 			<DeleteModal
// 				isOpen={toggleDeleteModal}
// 				closeDialog={() => setToggleDeleteModal(false)}
// 				handleDelete={() => deletePlanById()}
// 			/>
// 			<ConditionReturnFormDialogForPlan
// 				isOpen={togglePlanDialog}
// 				closeDialog={() => {
// 					setTogglePlanDialog(!togglePlanDialog);
// 					setEditingPlan(undefined);
// 				}}
// 				editingPlan={editingPlan}
// 				handleCreate={createClassIntoStore}
// 				handleEdit={updateClassIntoStore}
// 			/>
// 		</>
// 	);
// }
