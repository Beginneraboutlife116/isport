import { useState } from 'react';
import styled from './styles.module.scss';

function ReviewItem() {
	return (
		<div className={styled.container__reviewWrap}>
			{/* info */}
			<div className={styled.container__infoWrap}>
				<div className={styled.container__info}>
					<div>
						<img src='' alt='' />
						大頭照
					</div>

					<div className={styled.container__name}>
						<span>暱稱</span>
						<span>2023-06-25</span>
					</div>
				</div>

				<div className={styled.container__rating}>
					<span>9.8</span>
				</div>
			</div>

			{/* text */}
			<div className={styled.container__textWrap}>
				<span className={styled['container__textWrap--text']}>
					評論內容 : Lorem ipsum dolor sit, amet consectetur adipisicing elit. Earum consequatur
					aperiam ullam laborum ab natus, minus sapiente quibusdam sit distinctio doloremque dolorem
					eius est cupiditate sequi odio alias in officia.
				</span>
			</div>
		</div>
	);
}

function Review() {
	const [hoverRating, setHoverRating] = useState(0);
	const [selectedRating, setSelectedRating] = useState(0);

	const handleMouseEnter = (rating: number) => {
		setHoverRating(rating);
	};

	const handleMouseLeave = () => {
		setHoverRating(0);
	};

	const handleClick = (rating: number) => {
		setSelectedRating(rating);
	};

	return (
		<div className={styled.container}>
			{/* Reviews */}
			<ReviewItem />
			<ReviewItem />

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
