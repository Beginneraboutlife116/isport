import { Link } from 'react-router-dom';
import styles from './styles.module.scss';

type PlanItem = {
	planName: string;
	planType: string;
	amountLeft: number;
};

type PlanItemProps = {
	id: number;
	storeName: string;
	plans: PlanItem[];
};

export default function PlanItem({ id, storeName, plans }: PlanItemProps) {
	return (
		<li className={styles.item}>
			<Link to={`/store/${id}`}>
				<header className={`${styles.item__header} ${styles.item__row}`}>
					<h3>{storeName}</h3>
				</header>
			</Link>
			<ul aria-label={`${storeName} 目前剩餘方案狀況`}>
				<li>
					{plans.map((plan) => (
						<>
							<div className={`${styles.item__planType} ${styles.item__row}`}>
								<p>{plan.planName}</p>
								<p>{plan.planType}</p>
							</div>
							<div className={`${styles.item__planRest} ${styles.item__row}`}>
								<p>{plan.planType.includes('次') ? '剩餘次數' : '剩餘天數'}</p>
								<p>
									{plan.planType.includes('次') ? `${plan.amountLeft} 次` : `${plan.amountLeft} 天`}
								</p>
							</div>
						</>
					))}
				</li>
			</ul>
		</li>
	);
}
