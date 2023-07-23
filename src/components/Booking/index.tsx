import { useEffect, useState } from 'react';
import { useStoresData } from '../../contexts/findContext';
import styled from './styles.module.scss';
import { bookingClass, fetchUserPlans } from '../../api/plan';
import { useNavigate } from 'react-router-dom';

type BookingProps = {
	setStatus: React.Dispatch<React.SetStateAction<string>>;
};

function Booking({ setStatus }: BookingProps) {
	const { classData } = useStoresData();
	const [userPlans, setUserPlans] = useState<any[]>([]);
	const [noPlans, setNoPlans] = useState('');
	const [remark, setRemark] = useState('');
	const [done, setDone] = useState('');
	const [userPlanId, setUserPlanId] = useState<number>(0);
	const [selectedOption, setSelectedOption] = useState('');
	const storedData = localStorage.getItem('isport');
	let dataObject: { token?: string } = {};
	if (storedData) {
		dataObject = JSON.parse(storedData);
	}
	const authToken = dataObject.token;
	const storeId = localStorage.getItem('oneStoreId');
	const numberStoreId = Number(storeId);
	const classId = classData[0].id;
	const navigate = useNavigate();

	const handleRemark = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const inputValue = e.target.value;
		setRemark(inputValue);
	};

	const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedValue = e.target.value;
		setSelectedOption(selectedValue); // 更新選中的選項
	};

	const handleBooking = async () => {
		await bookingClass(authToken || '', classId, userPlanId, remark);
		setDone('預約成功');
		setRemark('');

		// 更新使用者擁有方案
		const result = await fetchUserPlans(authToken || '', numberStoreId);
		if (result) {
			if ('res' in result) {
				const { res, noPlans } = result;
				setUserPlans(res);
				setNoPlans(noPlans);
			}
		}

		setTimeout(() => {
			setDone('');
		}, 1000);
		if (noPlans === 'error') {
		}
		navigate('/reservation');
	};

	const handleBackClick = () => {
		setStatus('course');
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				// 取得使用者擁有方案
				const result = await fetchUserPlans(authToken || '', numberStoreId);
				if (result) {
					if ('res' in result) {
						const { res, noPlans } = result;
						setUserPlans(res);
						setNoPlans(noPlans);
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
			{/* select plan */}
			<div className={styled.container__infoWrap}>
				<span className={styled['container__infoWrap--title']}>{classData[0].className}</span>
				<span>
					{`${classData[0].date}(${classData[0].weekDay}) ${classData[0].startTime}~${classData[0].endTime}`}
				</span>
				<select
					name='plan'
					id='plan'
					onChange={(e) => {
						setUserPlanId(Number(e.target.value));
						handleSelectChange(e);
					}}
					className={styled['container__infoWrap--select']}
				>
					<option value='' style={{ color: 'gray' }}>
						{noPlans === 'error' ? '目前沒有購買任何方案' : '請選擇方案'}
					</option>

					{userPlans && (
						<>
							{userPlans.map((item) => (
								<option value={item.id} key={item.id}>
									{item.planName}(剩餘{item.amountLeft}
									{item.expireDate ? '天' : '堂'})
								</option>
							))}
						</>
					)}
				</select>
			</div>

			{/* text */}
			<div>
				<textarea
					placeholder='預約備註'
					onChange={handleRemark}
					maxLength={50}
					className={styled.container__input}
				/>
				{remark.length >= 50 && <span className={styled.container__span}>備註不可超過50字!</span>}
			</div>

			{/* send button */}
			<div className={styled.container__buttonWrap}>
				<button onClick={handleBackClick} className={styled.container__backButton}>
					返回課程
				</button>

				{noPlans || userPlanId === 0
					? null
					: done === '預約成功' && (
							<span className={styled['container__buttonWrap--done']}>{done}!</span>
					  )}

				<button
					onClick={handleBooking}
					disabled={!selectedOption}
					className={styled.container__button}
				>
					送出預約
				</button>
			</div>
		</div>
	);
}

export default Booking;
