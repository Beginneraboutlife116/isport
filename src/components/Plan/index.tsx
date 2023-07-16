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
				const authToken =
					'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ1c2VyMkBleGFtcGxlLmNvbSIsImF2YXRhciI6Imh0dHBzOi8vaW1ndXIuY29tLzVPTDV3SnQucG5nIiwibmlja25hbWUiOiJ1c2VyMiIsInJvbGUiOiJ1c2VyIiwic3RvcmVOYW1lIjpudWxsLCJjcmVhdGVkQXQiOiIyMDIzLTA3LTEwVDE3OjEyOjMwLjAwMFoiLCJ1cGRhdGVkQXQiOiIyMDIzLTA3LTEwVDE3OjEyOjMwLjAwMFoiLCJpYXQiOjE2ODkyMzYwNTMsImV4cCI6MTY5MTgyODA1M30.ScuJmJpzQoO-95_VM_I7W-VUBnkaXXuWRjE2DsvzvkQ';

				// 取得場館館方案
				const oneStoreId = localStorage.getItem('oneStoreId');
				const storeIdNumber = Number(oneStoreId);
				const storePlans = await fetchStorePlan(authToken, storeIdNumber);
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
