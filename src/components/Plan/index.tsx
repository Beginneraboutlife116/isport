import { useEffect, useState } from 'react';
import styled from './styles.module.scss';
import { fetchStorePlan } from '../../api/stores';

type Plans = {
	id: number;
	planName: string;
	price: string;
};

function Plan() {
	const [plans, setPlans] = useState<Plans[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const storedData = localStorage.getItem('isport');
				let dataObject: { token?: string } = {};
				if (storedData) {
					dataObject = JSON.parse(storedData);
				}
				const authToken = dataObject.token;

				// 取得場館館方案
				const oneStoreId = localStorage.getItem('oneStoreId');
				const storeIdNumber = Number(oneStoreId);
				const storePlans = await fetchStorePlan(authToken || '', storeIdNumber);
				setPlans(storePlans);
			} catch (error) {
				console.log(error);
			}
		};
		fetchData();
	}, []);
	return (
		<>
			{plans.map((item) => (
				<div className={styled.container} key={item.id}>
					<div className={styled.container__course}>
						<span>{item.planName}</span>
					</div>
					<div className={styled.container__price}>
						<span>NT${item.price}</span>
						<button className={styled['container__price--button']}>購買</button>
					</div>
				</div>
			))}
		</>
	);
}

export default Plan;
