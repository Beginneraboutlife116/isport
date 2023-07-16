import { fetchCancelStore } from '../../api/cancel';
import { fetchCollectionData } from '../../api/stores';
import styled from './styles.module.scss';
import { useEffect, useState, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';

type ItemProps = {
	date: string;
	startTime: string;
	endTime: string;
	storeName: string;
	storeId: number;
	reservationId: number;
	className: string;
	weekDay: string;
	data: any[];
	setData: React.Dispatch<React.SetStateAction<any[]>>;
};

function Item({
	date,
	startTime,
	endTime,
	storeName,
	storeId,
	reservationId,
	className,
	weekDay,
	data,
	setData,
}: ItemProps) {
	const [showModal, setShowModal] = useState(false);
	const navigate = useNavigate();

	function handleCancel() {
		setShowModal(true);
	}

	async function handleConfirm() {
		const filterClass = data.filter((item) => item.reservationId !== reservationId);
		setData(filterClass);
		const storedData = localStorage.getItem('isport');
		let dataObject: { token?: string } = {};
		if (storedData) {
			dataObject = JSON.parse(storedData);
		}
		const authToken = dataObject.token;

		// 取消預約課程
		await fetchCancelStore(authToken || '', reservationId);
		setShowModal(false);
	}

	function handleCancelModal() {
		setShowModal(false);
	}

	// 點擊單一場館跳轉頁面
	const handleStoreClick = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		const storeId = localStorage.getItem('oneStoreId');
		const id = Number(storeId);
		navigate(`/find/${id}`);
	};
	return (
		<div className={styled.container__item} key={storeId}>
			<span>{`${date} (${weekDay})`}</span>
			<span>
				{startTime} ~ {endTime}
			</span>
			{/* 點擊跳轉到特定場館頁面 */}
			<button className={styled.container__store} onClick={handleStoreClick}>
				{storeName}
			</button>
			<span className={styled.container__class}>{className}</span>
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
	const [data, setData] = useState<any[]>([]);
	const [dataLength, setDataLength] = useState(0);
	const [noClasses, setNoClasses] = useState('');

	useEffect(() => {
		const fetchData = async () => {
			try {
				const storedData = localStorage.getItem('isport');
				let dataObject: { token?: string } = {};
				if (storedData) {
					dataObject = JSON.parse(storedData);
				}
				const authToken = dataObject.token;

				// 取得使用者預約課程
				const result = await fetchCollectionData(authToken || '');

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
						data.map((item) => (
							<Item
								key={item.reservationId}
								storeId={item.storeId}
								reservationId={item.reservationId}
								date={item.date}
								startTime={item.startTime}
								endTime={item.endTime}
								storeName={item.storeName}
								weekDay={item.weekDay}
								className={item.className}
								data={data}
								setData={setData}
							/>
						))
					)}
				</div>
			</div>
		</div>
	);
}

export default ReservationList;
