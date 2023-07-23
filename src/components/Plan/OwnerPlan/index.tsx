import Button from '../../Button';
import { MdEdit } from 'react-icons/md';
import { RxCross1 } from 'react-icons/rx';
import { PlanType } from '../../../pages/OwnerStore/OwnerPlans';

type OwnerPlanType = {
	plan: PlanType;
	openDeleteModal: (id: number) => void;
	openEditDialog: (id: number) => void;
};

export default function OwnerPlan({ plan, openEditDialog, openDeleteModal }: OwnerPlanType) {
	const {id, planName, price, planAmount, planType} = plan;
	return (
		<li>
			<h3>{planName}</h3>
			<p>{`${planType}方案: ${planAmount}次`}</p>
			<span>{`NT$ ${price}`}</span>
			<div>
				<Button onClick={() => openEditDialog(id)}>
					<MdEdit style={{ fontSize: '1.5rem' }} />
				</Button>
				<Button onClick={() => openDeleteModal(id)}>
					<RxCross1 style={{ fontSize: '1.5rem' }} />
				</Button>
			</div>
		</li>
	);
}
