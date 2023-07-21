import styled from './styles.module.scss';
import { GiCancel } from 'react-icons/gi';

interface Props {
	handlePurchaseClick: () => void;
	planName: string;
	price: number;
	id: number;
	formData: {
		MerchantID: string;
		TradeInfo: string;
		TradeSha: string;
		Version: string;
	};
}

function PurchaseModal({ handlePurchaseClick, planName, price, id, formData }: Props) {
	return (
		<div className={styled.container} key={id}>
			<div className={styled.container__modal}>
				<div onClick={handlePurchaseClick} className={styled['container__modal--xButton']}>
					<GiCancel size={25} />
				</div>

				<div className={styled.container__info}>
					<div className={styled['container__info--text']}>
						<span>方案:</span>
						<span>{planName}</span>
					</div>
					<div className={styled['container__info--text']}>
						<span>金額:</span>
						<span>NT${price}</span>
					</div>
				</div>

				<div className={styled.container__buttonWrap}>
					<button onClick={handlePurchaseClick} className={styled['container__buttonWrap--cancel']}>
						取消
					</button>

					{/* 藍星金流 */}
					<form id='orderForm' method='post' action='https://ccore.newebpay.com/MPG/mpg_gateway'>
						<input type='hidden' name='MerchantID' value={formData.MerchantID} />
						<input type='hidden' name='TradeInfo' value={formData.TradeInfo} />
						<input type='hidden' name='TradeSha' value={formData.TradeSha} />
						<input type='hidden' name='Version' value={formData.Version} />
						<button type='submit' className={styled['container__buttonWrap--confirm']}>
							確認付款
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}

export default PurchaseModal;
