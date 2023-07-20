import styled from './styles.module.scss';
import { GiCancel } from 'react-icons/gi';

interface Props {
	handlePurchaseClick: () => void;
	planName: string;
	price: string;
	id: number;
}

function PurchaseModal({ handlePurchaseClick, planName, price, id }: Props) {
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
					<button className={styled['container__buttonWrap--confirm']}>確認付款</button>
				</div>
			</div>
		</div>
	);
}

export default PurchaseModal;
