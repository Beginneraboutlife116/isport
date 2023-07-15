import { fetchCollectionData } from '../../api/stores';
import styled from './styles.module.scss';
import { useEffect, useState } from 'react';

// data: [
// 	{
// 	id,
// 	class: {
// 		date,
// 		startTime,
// 		endTime,
// 		storeName,
// 		storeId,
// 		className
// 	}
// 	},

type ItemProps = {
	date: string;
	startTime: string;
	endTime: string;
	storeName: string;
	storeId: number;
	className: string;
};

type ReservationData = {
	id: number;
	class: {
		date: string;
		startTime: string;
		endTime: string;
		storeName: string;
		storeId: number;
		className: string;
	};
};

function Item({ date, startTime, endTime, storeName, storeId, className }: ItemProps) {
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
		<div className={styled.container__item} id={storeId}>
			<span>{date}</span>
			<span>
				{startTime} ~ {endTime}
			</span>
			<button className={styled.container__store}>{storeName}</button>
			<span>{className}</span>
			<button className={styled.container__cancel} onClick={handleCancel}>
				取消
			</button>

			{/* 按下取消鍵的彈出視窗 */}
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
	const [data, setData] = useState([]);
	const [dataLength, setDataLength] = useState(0);
	const [noClasses, setNoClasses] = useState('');

	useEffect(() => {
		const fetchData = async () => {
			try {
				const authToken =
					'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ1c2VyMkBleGFtcGxlLmNvbSIsImF2YXRhciI6Imh0dHBzOi8vaW1ndXIuY29tLzVPTDV3SnQucG5nIiwibmlja25hbWUiOiJ1c2VyMiIsInJvbGUiOiJ1c2VyIiwic3RvcmVOYW1lIjpudWxsLCJjcmVhdGVkQXQiOiIyMDIzLTA3LTEwVDE3OjEyOjMwLjAwMFoiLCJ1cGRhdGVkQXQiOiIyMDIzLTA3LTEwVDE3OjEyOjMwLjAwMFoiLCJpYXQiOjE2ODkyMzYwNTMsImV4cCI6MTY5MTgyODA1M30.ScuJmJpzQoO-95_VM_I7W-VUBnkaXXuWRjE2DsvzvkQ';

				// 取得使用者預約課程
				const result = await fetchCollectionData(authToken);

				// 判斷使用者有無預約課程
				if (result) {
					if ('res' in result) {
						const { res, noReservations } = result;
						if (res !== undefined) {
							setDataLength(res.length);
						}
						setData(res);
						setNoClasses(noReservations);
					}
				}
			} catch (error) {
				console.log(error);
			}
		};
		fetchData();
	}, []);

	return (
		<div className={styled.container}>
			<div className={styled.container__numberWrap}>
				<span className={styled.container__number}>{dataLength}</span>
				<span className={styled.container__text}>即將到來</span>
			</div>

			<div className={styled.container__list}>
				<div className={styled.container__title}>
					<span>即將到來</span>
				</div>

				{/* list */}
				<div className={styled.container__itemWrap}>
					{noClasses === 'error' ? (
						<div className={styled.container__noBooking}>目前無預約課程!!</div>
					) : (
						// {data.map}
						<Item />
					)}
				</div>
			</div>
		</div>
	);
}

export default ReservationList;
