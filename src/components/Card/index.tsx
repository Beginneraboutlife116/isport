import { BiSolidMap } from 'react-icons/bi';
import { BsHeart, BsHeartFill } from 'react-icons/bs';
import { BsFillTelephoneFill } from 'react-icons/bs';
import { MdEmail } from 'react-icons/md';
import { useState, MouseEvent } from 'react';
import styled from './styles.module.scss';
import { addLikeStore, deleteLikeStore } from '../../api/like';
import { useNavigate } from 'react-router-dom';
import { useStoresData } from '../../contexts/findContext';

type CardProps = {
	id: number;
	storeName: string;
	rating: number;
	reviewCounts: number;
	introduction: string;
	photo: string;
	isLiked?: boolean;
	address?: string;
	email?: string;
	phone?: string;
};

function Card({
	id,
	storeName,
	rating,
	reviewCounts,
	introduction,
	photo,
	isLiked,
	address,
	email,
	phone,
}: CardProps) {
	const { oneStore } = useStoresData();
	const [isStoreLiked, setIsStoreLiked] = useState(isLiked);
	const navigate = useNavigate();

	// 新增或取消收藏場館
	const handleToggleLike = async (storeId: number) => {
		const authToken =
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ1c2VyMkBleGFtcGxlLmNvbSIsImF2YXRhciI6Imh0dHBzOi8vaW1ndXIuY29tLzVPTDV3SnQucG5nIiwibmlja25hbWUiOiJ1c2VyMiIsInJvbGUiOiJ1c2VyIiwic3RvcmVOYW1lIjpudWxsLCJjcmVhdGVkQXQiOiIyMDIzLTA3LTEwVDE3OjEyOjMwLjAwMFoiLCJ1cGRhdGVkQXQiOiIyMDIzLTA3LTEwVDE3OjEyOjMwLjAwMFoiLCJpYXQiOjE2ODkyMzYwNTMsImV4cCI6MTY5MTgyODA1M30.ScuJmJpzQoO-95_VM_I7W-VUBnkaXXuWRjE2DsvzvkQ';

		try {
			if (isStoreLiked) {
				// 取消收藏
				await deleteLikeStore(authToken, storeId);
			} else {
				// 新增收藏
				await addLikeStore(authToken, storeId);
			}
			setIsStoreLiked((preLiked) => !preLiked);
		} catch (error) {
			console.log(error);
		}
	};

	// 點擊單一場館跳轉頁面
	const handleCardClick = (e: MouseEvent<HTMLDivElement>) => {
		e.preventDefault();
		navigate(`/find/${id}`);
		localStorage.setItem('oneStoreId', String(id));
	};

	return (
		<div className={styled.card} key={id}>
			<div className={styled.card__imgWrap}>
				<img
					src={photo}
					alt={storeName}
					className={styled['card__imgWrap--img']}
					onClick={handleCardClick}
				/>
			</div>

			{/* info */}
			<div className={styled.card__infoWrap}>
				{/* store true or false render */}
				{!oneStore ? (
					// stores version
					<>
						<span className={styled['card__infoWrap--title']}>{storeName}</span>

						<div className={styled.card__infoWrap__detailWrap}>
							<div className={styled.card__infoWrap__detailWrap__detail}>
								<div className={styled.card__infoWrap__detailWrap__detail__map}>
									<BiSolidMap className={styled['card__infoWrap__detailWrap__detail__map--logo']} />
									<span>Map</span>
								</div>

								<div className={styled['card__infoWrap__detailWrap__detail--rating']}>{rating}</div>

								<div className={styled['card__infoWrap__detailWrap__detail--review']}>
									{reviewCounts}則評論
								</div>
							</div>

							{/* 愛心收藏圖案功能 */}
							<div onClick={() => handleToggleLike(id)}>
								{!isStoreLiked ? (
									<BsHeart style={{ fontSize: '24px' }} />
								) : (
									<BsHeartFill style={{ fontSize: '24px', color: 'red' }} />
								)}
							</div>

							{/* 這裡可以加入商家的鉛筆圖案編輯功能 */}
						</div>

						<div className={styled['card__infoWrap--text']}>{introduction}</div>
					</>
				) : (
					// one store version
					<div className={styled.card__storeInfoWrap}>
						{/* store-name */}
						<div className={styled['card__storeInfoWrap--title']}>
							<span>{storeName}</span>
							{/* 愛心收藏圖案功能 */}
							<div onClick={() => handleToggleLike(id)}>
								{!isStoreLiked ? (
									<BsHeart style={{ fontSize: '24px' }} />
								) : (
									<BsHeartFill style={{ fontSize: '24px', color: 'red' }} />
								)}
							</div>

							{/* 這裡可以加入商家的鉛筆圖案編輯功能 */}
						</div>

						{/* address */}
						<div className={styled['card__storeInfoWrap--address']}>
							<BiSolidMap className={styled['card__storeInfoWrap--addressIcon']} />
							<span>{address}</span>
						</div>

						{/* review */}
						<div className={styled['card__storeInfoWrap--review']}>
							<span className={styled['card__storeInfoWrap--rating']}>{rating}</span>
							<span>{reviewCounts}則評論</span>
						</div>

						<div>{introduction}</div>

						{/* phone */}
						<div className={styled['card__storeInfoWrap--phone']}>
							<BsFillTelephoneFill className={styled['card__storeInfoWrap--phoneIcon']} />
							<span>{phone}</span>
						</div>

						{/* email */}
						<div className={styled['card__storeInfoWrap--email']}>
							<MdEmail className={styled['card__storeInfoWrap--emailIcon']} />
							<span>{email}</span>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default Card;
