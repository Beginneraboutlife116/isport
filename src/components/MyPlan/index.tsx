import PlanItem from './PlanItem';
import styles from './styles.module.scss';

const dummyData = [
	{
		storeName: 'xxx 場館',
		storeId: 1,
		plans: [
			{
				planName: '30堂方案',
				planType: '次數方案',
				amountLeft: 5,
			},
			{
				planName: '30天方案',
				planType: '天數方案',
				amountLeft: 25,
			},
		],
	},
	{
		storeName: 'xxx 場館',
		storeId: 2,
		plans: [
			{
				planName: '8堂方案',
				planType: '次數方案',
				amountLeft: 7,
			},
		],
	},
];

export default function MyPlan() {
	return (
		<ul className={styles.myPlan}>
			{dummyData.map((data) => (
				<PlanItem
					key={data.storeId}
					storeName={data.storeName}
					id={data.storeId}
					plans={data.plans}
				/>
			))}
		</ul>
	);
}
