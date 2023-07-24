import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { UserPlanType } from '..';
import styles from './styles.module.scss';

type PlanItemProps = {
	id: number;
	storeName: string;
	plans: UserPlanType[];
};

export default function PlanItem({ id, storeName, plans }: PlanItemProps) {
	const isPlanMissing = plans.some((plan) => plan.planName !== null && plan.planType !== null);
	return (
		isPlanMissing && (
			<li className={styles.item}>
				<Link to={`/find/${id}`} onClick={() => localStorage.setItem('oneStoreId', id.toString())}>
					<header className={`${styles.item__header} ${styles.item__row}`}>
						<h3>{storeName}</h3>
					</header>
				</Link>
				<ul aria-label={`${storeName} 目前剩餘方案狀況`}>
					<li>
						{plans.map((plan) => {
							if (plan.planType !== null && plan.planName !== null) {
								return (
									<Fragment key={plan.id}>
										<div className={`${styles.item__planType} ${styles.item__row}`}>
											<p>{plan.planName}</p>
											<p>{plan.planType}</p>
										</div>
										<div className={`${styles.item__planRest} ${styles.item__row}`}>
											<p>{plan.planType.includes('次') ? '剩餘次數' : '剩餘天數'}</p>
											<p>
												{plan.planType.includes('次')
													? `${plan.amountLeft} 次`
													: `${plan.amountLeft} 天`}
											</p>
										</div>
									</Fragment>
								);
							}
						})}
					</li>
				</ul>
			</li>
		)
	);
}
