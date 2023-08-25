import { useEffect, useState, SetStateAction, forwardRef, useRef } from 'react';
import { useParams } from 'react-router-dom';
import styled from './styles.module.scss';
import { fetchStoreReview } from '../../api/stores';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import { addComment } from '../../api/comment';
import { LoadingPlaceholder } from '../Loading';
import useIntersectionObserver from '../../util/useIntersectionObserver';
import { isAxiosError } from '../../util/helpers';

export type ItemProps = {
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

export const ReviewItem = forwardRef<HTMLDivElement, ItemProps>(function ReviewItem(
	{ avatar, content, createdAt, nickname, rating },
	reviewRef,
) {
	return (
		<div className={styled.container__reviewWrap} ref={reviewRef}>
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
});

export function ReviewPlaceholder() {
	return (
		<div className={styled.container__reviewWrap}>
			{/* info */}
			<div className={styled.container__infoWrap}>
				<div className={styled.container__info}>
					<div>
						<LoadingPlaceholder className={styled['container__info--avatar']} />
					</div>

					<div className={styled.container__name}>
						<LoadingPlaceholder className={styled.placeholder} />
						<LoadingPlaceholder className={styled.placeholder} />
					</div>
				</div>

				<div className={styled.container__rating}>
					<span>0</span>
				</div>
			</div>

			{/* text */}
			<div className={styled.container__textWrap}>
				<LoadingPlaceholder className={styled['container__textWrap--text']} />
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
	const { id } = useParams();
	const REVIEWS_PER_PAGE = 3;
	const [reviewsPage, setReviewsPage] = useState<number>(0);
	const [isPending, setIsPending] = useState<boolean>(false);
	const [noDataMessage, setNoDataMessage] = useState<string>('');
	const rootRef = useRef<HTMLDivElement>(null);
	const [hasMounted, setHasMounted] = useState<boolean>(false);
	const [hasMoreReviews, setHasMoreReviews] = useState<boolean>(true);
	const lastReviewRef = useIntersectionObserver(
		(entries) => {
			if (entries[0].isIntersecting && hasMoreReviews) {
				setReviewsPage(reviewsPage + 1);
			}
		},
		{
			root: rootRef.current,
			threshold: 0.5,
		},
		hasMounted,
	);

	const storeIdNumber = parseInt(id as string, 10);
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
			try {
				const response = await fetchStoreReview(
					authToken || '',
					storeIdNumber,
					reviewsPage,
					REVIEWS_PER_PAGE,
				);
				if (response.status === 200) {
					setReviews(response.data);
					setReviewsPage(0);
					setRating(0);
					setComment('');
					setHasMoreReviews(true);
				}
			} catch (error) {
				console.error(error);
			}
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				// 取得場館評論
				setIsPending(true);
				const response = await fetchStoreReview(
					authToken || '',
					storeIdNumber,
					reviewsPage,
					REVIEWS_PER_PAGE,
				);
				if (response.status === 200) {
					setReviews([...reviews, ...response.data]);
					if (response.data.length < REVIEWS_PER_PAGE) {
						setHasMoreReviews(false);
					}
				}
			} catch (error) {
				if (isAxiosError(error)) {
					if (!reviews.length) {
						setNoDataMessage(error.response?.data.message);
					}
				}
			} finally {
				setIsPending(false);
			}
		};
		fetchData();
	}, [storeIdNumber, reviewsPage, REVIEWS_PER_PAGE, authToken]);

	useEffect(() => {
		setHasMounted(!isPending && !noDataMessage);
	}, [isPending, noDataMessage]);

	return (
		<div className={styled.container}>
			{/* Reviews */}
			<div className={styled.container__reviewCon} ref={rootRef}>
				{isPending ? (
					reviews.length ? (
						<ReviewPlaceholder />
					) : (
						new Array(REVIEWS_PER_PAGE)
							.fill(null)
							.map(() => <ReviewPlaceholder key={crypto.randomUUID()} />)
					)
				) : null}
				{noDataMessage ? (
					<p>{noDataMessage}</p>
				) : (
					reviews.map((item, index) => {
						if ((index + 1) % (REVIEWS_PER_PAGE * (reviewsPage + 1)) === 0) {
							return <ReviewItem key={item.id} {...item} ref={lastReviewRef} />;
						} else {
							return <ReviewItem key={item.id} {...item} />;
						}
					})
				)}
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
