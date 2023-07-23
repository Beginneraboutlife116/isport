import { useEffect, useState, SetStateAction } from 'react';
import styled from './styles.module.scss';
import { fetchStoreReview } from '../../api/stores';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import { addComment } from '../../api/comment';

type ItemProps = {
	id?: number;
	avatar: string;
	content: string;
	createdAt: string;
	nickname: string;
	rating: number;
};

type StarRatingProps = {
	setRating: React.Dispatch<SetStateAction<number>>;
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

function StarRating({ rating, setRating }: StarRatingProps) {
	return (
		<Stack spacing={1}>
			<Rating
				name='half-rating'
				value={rating}
				precision={0.5}
				onChange={(_, newValue) => {
					if (newValue !== null) {
						setRating(newValue);
					}
				}}
			/>
		</Stack>
	);
}

function Review() {
	const [reviews, setReviews] = useState<ItemProps[]>([]);
	const [rating, setRating] = useState(0);
	const [comment, setComment] = useState('');
	const oneStoreId = localStorage.getItem('oneStoreId');
	const storeIdNumber = Number(oneStoreId);
	const storedData = localStorage.getItem('isport');
	let dataObject: { token?: string } = {};
	if (storedData) {
		dataObject = JSON.parse(storedData);
	}
	const authToken = dataObject.token;

	const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const inputValue = e.target.value;
		if (inputValue.length <= 100) {
			setComment(inputValue);
		}
	};

	const handleSendComment = async () => {
		// 送出評論
		if (rating !== 0 && comment !== '') {
			await addComment(authToken || '', storeIdNumber, rating, comment);
			const storeReview = await fetchStoreReview(authToken || '', storeIdNumber);
			setReviews(storeReview);
			setRating(0);
			setComment('');
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				// 取得場館評論
				const storeReview = await fetchStoreReview(authToken || '', storeIdNumber);
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
			<div className={styled.container__reviewCon}>
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
			</div>

			{/* send review */}
			<div className={styled.container__replyWrap}>
				<h2>我要評價</h2>
				<textarea
					placeholder='請輸入評論'
					value={comment}
					onChange={handleInputChange}
					className={styled['container__replyWrap--input']}
				/>
				{comment === '' && (
					<span className={styled['container__replyWrap--comment']}>送出前評論欄不能空白!</span>
				)}
				{comment.length >= 100 && (
					<span className={styled['container__replyWrap--comment']}>不能超過100字!</span>
				)}

				<div className={styled.container__buttonWrap}>
					<div className={styled.container__starWrap}>
						<span>請點選評分</span>

						{/* star icon */}
						<div>
							<StarRating rating={rating} setRating={setRating} />
							{rating === 0 && (
								<span className={styled['container__replyWrap--comment']}>送出前請選擇評分!</span>
							)}
						</div>
					</div>

					<div>
						<button onClick={handleSendComment} className={styled['container__buttonWrap--button']}>
							送出
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Review;
