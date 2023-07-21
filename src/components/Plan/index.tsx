import { useEffect, useState } from 'react';
import styled from './styles.module.scss';
import { fetchStorePlan } from '../../api/stores';
import PurchaseModal from '../PurchaseModal';
import { postPurchaseData } from '../../api/purchase';

type Plans = {
	id: number;
	planName: string;
	price: number;
};

function Plan() {
	const [plans, setPlans] = useState<Plans[]>([]);
	const [selectedPlan, setSelectedPlan] = useState<Plans | null>(null);
	const [formData, setFormData] = useState({
		MerchantID: '',
		TradeInfo: '',
		TradeSha: '',
		Version: '',
	});

	const handlePurchaseClick = async (plan: Plans) => {
		setSelectedPlan(plan);
		const storedData = localStorage.getItem('isport');
		let dataObject: { token?: string } = {};
		if (storedData) {
			dataObject = JSON.parse(storedData);
		}
		const authToken = dataObject.token;
		const oneStoreId = localStorage.getItem('oneStoreId');
		const storeIdNumber = Number(oneStoreId);

		const result = await postPurchaseData(
			authToken || '',
			plan.price,
			plan.id,
			plan.planName,
			storeIdNumber,
		);
		console.log(plan);

		setFormData({
			...formData,
			MerchantID: result.MerchantID,
			TradeInfo: result.TradeInfo,
			TradeSha: result.TradeSha,
			Version: result.Version,
		});
	};

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
		<div>
			{plans.map((item) => (
				<div className={styled.container} key={item.id}>
					<div className={styled.container__course}>
						<span>{item.planName}</span>
					</div>
					<div className={styled.container__price}>
						<span>NT${item.price}</span>
						<button
							onClick={() => handlePurchaseClick(item)}
							className={styled['container__price--button']}
						>
							購買
						</button>

						{selectedPlan && (
							<PurchaseModal
								handlePurchaseClick={() => setSelectedPlan(null)}
								id={selectedPlan.id}
								planName={selectedPlan.planName}
								price={selectedPlan.price}
								formData={formData}
							/>
						)}
					</div>
				</div>
			))}
		</div>
	);
}

export default Plan;
