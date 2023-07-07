import styled from './styles.module.scss';
import { useState } from 'react';

function Item() {
	const [showModal, setShowModal] = useState(false);

	function handleCancel() {
		setShowModal(true);
	}

	function handleConfirm() {
		// 按下確認鍵後撰寫 filter 邏輯
		setShowModal(false);
	}

	function handleCancelModal() {
		setShowModal(false);
	}

	return (
		<div className={styled.container__item}>
			<span>2023-06-25 (日)</span>
			<span>15:00 ~ 16:00</span>
			<button className={styled.container__store}>XXX場館</button>
			<span>XXX課程</span>
			<button className={styled.container__cancel} onClick={handleCancel}>
				取消
			</button>

			{showModal && (
				<div className={styled.container__modal}>
					<div className={styled.container__modalContent}>
						<p>是否確定要取消？</p>
						<div className={styled.container__modalButton}>
							<button onClick={handleConfirm}>確定</button>
							<button onClick={handleCancelModal}>取消</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

function ReservationList() {
	return (
		<div className={styled.container}>
			<div className={styled.container__numberWrap}>
				<span className={styled.container__number}>1</span>
				<span className={styled.container__text}>即將到來</span>
			</div>

			<div className={styled.container__list}>
				<div className={styled.container__title}>
					<span>即將到來</span>
				</div>

				{/* list */}
				<div className={styled.container__itemWrap}>
					<Item />
					<Item />
					<Item />
					<Item />
					<Item />
				</div>
			</div>
		</div>
	);
}

export default ReservationList;
