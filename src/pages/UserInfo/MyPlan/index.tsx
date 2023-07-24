import { useEffect, useState } from 'react';
import { getUserPlans } from '../../../api/user';
import PlanItem from './PlanItem';
import Loading from '../../../components/Loading';
import styles from './styles.module.scss';

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
	const [isFetching, setIsFetching] = useState<boolean>(false);

	useEffect(() => {
		async function fetchUserPlans() {
			try {
				setIsFetching(true);
				const response = await getUserPlans();
				if (response.status === 200) {
					const { data } = response;
					setPlans(data);
				}
			} catch (error) {
				console.error(error);
			} finally {
				setIsFetching(false);
			}
		}

		fetchUserPlans();
	}, []);

	return (
		<ul className={styles.myPlan}>
			{isFetching ? (
				<Loading />
			) : plans.length ? (
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
