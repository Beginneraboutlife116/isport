import { useEffect, useState } from 'react';
import styled from './styles.module.scss';
import { fetchStoreReview } from '../../api/stores';

type ItemProps = {
	id?: number;
	avatar: string;
	content: string;
	createdAt: string;
	nickname: string;
	rating: number;
};

function ReviewItem({ avatar, content, createdAt, nickname, rating }: ItemProps) {
	return (
		<div className={styled.container__reviewWrap}>
			{/* info */}
			<div className={styled.container__infoWrap}>
				<div className={styled.container__info}>
					<div>
						<img src={avatar} alt='avatar' className={styled['container__info--avatar']} />
					</div>

					<div className={styled.container__name}>
						<span>{nickname}</span>
						<span>{createdAt}</span>
					</div>
				</div>

				<div className={styled.container__rating}>
					<span>{rating}</span>
				</div>
			</div>

			{/* text */}
			<div className={styled.container__textWrap}>
				<span className={styled['container__textWrap--text']}>評論內容 : {content}</span>
			</div>
		</div>
	);
}

function Review() {
	const [hoverRating, setHoverRating] = useState(0);
	const [selectedRating, setSelectedRating] = useState(0);
	const [reviews, setReviews] = useState<ItemProps[]>([]);

	const handleMouseEnter = (rating: number) => {
		setHoverRating(rating);
	};

	const handleMouseLeave = () => {
		setHoverRating(0);
	};

	const handleClick = (rating: number) => {
		setSelectedRating(rating);
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const authToken =
					'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ1c2VyMkBleGFtcGxlLmNvbSIsImF2YXRhciI6Imh0dHBzOi8vaW1ndXIuY29tLzVPTDV3SnQucG5nIiwibmlja25hbWUiOiJ1c2VyMiIsInJvbGUiOiJ1c2VyIiwic3RvcmVOYW1lIjpudWxsLCJjcmVhdGVkQXQiOiIyMDIzLTA3LTEwVDE3OjEyOjMwLjAwMFoiLCJ1cGRhdGVkQXQiOiIyMDIzLTA3LTEwVDE3OjEyOjMwLjAwMFoiLCJpYXQiOjE2ODkyMzYwNTMsImV4cCI6MTY5MTgyODA1M30.ScuJmJpzQoO-95_VM_I7W-VUBnkaXXuWRjE2DsvzvkQ';

				// 取得場館館方案
				const oneStoreId = localStorage.getItem('oneStoreId');
				const storeIdNumber = Number(oneStoreId);
				const storeReview = await fetchStoreReview(authToken, storeIdNumber);
				setReviews(storeReview);
			} catch (error) {
				console.log(error);
			}
		};
		fetchData();
	}, []);

	return (
		<div className={styled.container}>
			{/* Reviews */}
			{reviews.map((item) => (
				<ReviewItem
					key={item.id}
					avatar={item.avatar}
					content={item.content}
					createdAt={item.createdAt}
					nickname={item.nickname}
					rating={item.rating}
				/>
			))}

			{/* send review */}
			<div className={styled.container__replyWrap}>
				<h2>我要評價</h2>
				<input
					type='text'
					placeholder='請輸入評論'
					className={styled['container__replyWrap--input']}
				/>

				<div className={styled.container__buttonWrap}>
					<div className={styled.container__starWrap}>
						<span>請點選評分</span>

						{/* star icon */}
						<div className={styled['container__starWrap--star']}>
							{[1, 2, 3, 4, 5].map((rating) => (
								<span
									key={rating}
									onMouseEnter={() => handleMouseEnter(rating)}
									onMouseLeave={handleMouseLeave}
									onClick={() => handleClick(rating)}
									style={{
										color: (hoverRating || selectedRating) >= rating ? 'gold' : 'gray',
										cursor: 'pointer',
									}}
								>
									★
								</span>
							))}
						</div>
					</div>

					<div>
						<button className={styled['container__buttonWrap--button']}>送出</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Review;
