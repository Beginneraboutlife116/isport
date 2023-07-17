import { useEffect, useState } from 'react';
import Card from '../../components/Card';
import styled from './styles.module.scss';
import Course from '../../components/Course';
import Plan from '../../components/Plan';
import Review from '../../components/Review';
import Booking from '../../components/Booking';
import { fetchOneStoreData, fetchStoreClasses } from '../../api/stores';
import { useStoresData } from '../../contexts/findContext';

type StoreData = {
	id: number;
	email: string;
	address: string;
	introduction: string;
	phone: string;
	photo: string;
	rating: number;
	reviewCounts: number;
	storeName: string;
	isLiked: boolean;
};

function Store() {
	const { setOneStore } = useStoresData();
	const [status, setStatus] = useState<string>('course');
	const [oneStoreData, setOneStoreData] = useState<StoreData | undefined>();
	const [storeClass, setStoreClass] = useState<any[]>([]);
	const mergedData = storeClass.reduce((acc, item) => {
		const { date } = item;
		if (!acc[date]) {
			acc[date] = [item];
		} else {
			acc[date].push(item);
		}
		return acc;
	}, {});

	function handleStatus(text: string) {
		setStatus(text);
	}

	useEffect(() => {
		const fetchData = async () => {
			try {
				const storedData = localStorage.getItem('isport');
				let dataObject: { token?: string } = {};
				if (storedData) {
					dataObject = JSON.parse(storedData);
				}
				const authToken = dataObject.token;

				// 取得單一場館資料
				const oneStoreId = localStorage.getItem('oneStoreId');
				const storeIdNumber = Number(oneStoreId);
				const oneStoreData = await fetchOneStoreData(authToken || '', storeIdNumber);
				setOneStoreData(oneStoreData);

				// 取得場館課程資料
				const classes = await fetchStoreClasses(authToken || '', storeIdNumber);
				setStoreClass(classes);
			} catch (error) {
				console.log(error);
			}
		};
		fetchData();
		setOneStore(true);
	}, []);

	return (
		<div className={styled.container}>
			<div className={styled.container__wrap}>
				<Card
					key={oneStoreData?.id}
					id={oneStoreData ? oneStoreData.id : 0}
					storeName={oneStoreData ? oneStoreData?.storeName : ''}
					rating={oneStoreData ? oneStoreData.rating : 0}
					reviewCounts={oneStoreData ? oneStoreData.reviewCounts : 0}
					introduction={oneStoreData ? oneStoreData.introduction : ''}
					photo={oneStoreData ? oneStoreData.photo : ''}
					isLiked={oneStoreData ? oneStoreData.isLiked : false}
					address={oneStoreData ? oneStoreData.address : ''}
					email={oneStoreData ? oneStoreData.email : ''}
					phone={oneStoreData ? oneStoreData.phone : ''}
				/>

				{/* status */}
				<div className={styled.container__status}>
					{status === 'booking' ? (
						''
					) : (
						<div className={styled.container__titleWrap}>
							<span
								className={styled['container__titleWrap--title']}
								onClick={() => handleStatus('course')}
								style={{ color: status === 'course' ? 'rgb(10, 186, 245)' : 'black' }}
							>
								課程
							</span>
							<span
								className={styled['container__titleWrap--title']}
								onClick={() => handleStatus('plan')}
								style={{ color: status === 'plan' ? 'rgb(10, 186, 245)' : 'black' }}
							>
								方案
							</span>
							<span
								className={styled['container__titleWrap--title']}
								onClick={() => handleStatus('review')}
								style={{ color: status === 'review' ? 'rgb(10, 186, 245)' : 'black' }}
							>
								評價
							</span>
						</div>
					)}

					{/* status component */}
					{status === 'review' ? (
						<div className={styled.container__reviewWrap}>
							<Review />
						</div>
					) : (
						<div className={styled.container__infoWrap}>
							{status === 'course' && <Course setStatus={setStatus} data={mergedData} />}

							{status === 'plan' && <Plan />}

							{status === 'booking' && <Booking setStatus={setStatus} />}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default Store;
