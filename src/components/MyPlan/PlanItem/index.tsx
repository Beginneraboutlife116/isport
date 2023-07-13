import { Link } from 'react-router-dom';
import styles from './styles.module.scss';

type PlanItemProps = {
	id: number;
	storeName: string;
	planName: string;
	planType: string;
	amountLeft: string;
};

export default function PlanItem({ id, storeName, planName, planType, amountLeft }: PlanItemProps) {
	return (
		<li className={styles.item}>
			<Link to={`/find/${id}/plans`}>
				<header className={`${styles.item__header} ${styles.item__row}`}>
					<h3>{storeName}</h3>
				</header>
			</Link>
			<ul aria-label={`${storeName} 目前剩餘方案狀況`}>
				<li>
					<div className={`${styles.item__planType} ${styles.item__row}`}>
						<p>{planName}</p>
						<p>{planType}</p>
					</div>
					<div className={`${styles.item__planRest} ${styles.item__row}`}>
						<p>{planType.includes('次') ? '剩餘次數' : '剩餘天數'}</p>
						<p>{planType.includes('次') ? `${amountLeft} 次` : `${amountLeft} 天`}</p>
					</div>
				</li>
			</ul>
		</li>
	);
}
