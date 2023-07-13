import PlanItem from './PlanItem';
import styles from './styles.module.scss';

const dummyData = [
	{
		id: 1,
		storeName: 'xxx 場館',
		planName: '30堂方案',
		planType: '次數方案',
		amountLeft: '5',
	},
	{
		id: 2,
		storeName: 'xxx 場館',
		planName: '30天方案',
		planType: '天數方案',
		amountLeft: '25',
	},
	{
		id: 3,
		storeName: 'xxx 場館',
		planName: '8堂方案',
		planType: '次數方案',
		amountLeft: '7',
	},
];

export default function MyPlan() {
	return (
		<ul className={styles.myPlan}>
			{dummyData.map((plan) => (
				<PlanItem key={plan.id} {...plan} />
			))}
		</ul>
	);
}
