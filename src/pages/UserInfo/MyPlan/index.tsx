import { useEffect, useState } from 'react';
import PlanItem from './PlanItem';
import styles from './styles.module.scss';
import { getUserPlans } from '../../../api/user';

export type UserPlanType = {
	id: number;
	amountLeft: number;
	expireDate: string | null;
	planName: string;
	planType: string;
	StoreName: string;
};

type PlanType = {
	storeId: number;
	storeName: string;
	UserPlans: UserPlanType[];
};

export default function MyPlanPage() {
	const [plans, setPlans] = useState<PlanType[] | []>([]);
	useEffect(() => {
		async function fetchUserPlans() {
			try {
				const response = await getUserPlans();
				if (response.status === 200) {
					const { data } = response;
					setPlans(data);
				}
			} catch (error) {
				console.error(error);
			}
		}

		fetchUserPlans();
	}, []);

	return (
		<ul className={styles.myPlan}>
			{plans.length ? (
				plans.map((plan) => (
					<PlanItem
						key={plan.storeId}
						storeName={plan.storeName}
						id={plan.storeId}
						plans={plan['UserPlans']}
					/>
				))
			) : (
				<h3 className={styles.noPlan}>目前無有效方案</h3>
			)}
		</ul>
	);
}
