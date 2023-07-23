import Button from '../../Button';
import { MdEdit } from 'react-icons/md';
import { RxCross1 } from 'react-icons/rx';
import { PlanType } from '../../../pages/OwnerStore/OwnerPlans';
import styles from './styles.module.scss';

type OwnerPlanType = {
	plan: PlanType;
	openDeleteModal: Function;
	openEditDialog: Function;
};

export default function OwnerPlan({ plan, openEditDialog, openDeleteModal }: OwnerPlanType) {
	const { id, planName, price, planAmount, planType } = plan;
	return (
		<li className={styles.plan}>
			<h3>{planName}</h3>
			<p>{`${planType}方案: ${planAmount} ${planType[0]}`}</p>
			<p>{`NT$ ${price}`}</p>
			<div>
				<Button onClick={() => openEditDialog(id)}>
					<MdEdit style={{ fontSize: '1.5rem' }} />
				</Button>
				<Button onClick={() => openDeleteModal()}>
					<RxCross1 style={{ fontSize: '1.5rem' }} />
				</Button>
			</div>
		</li>
	);
}
