import { BiSolidMap } from 'react-icons/bi';
import { BsHeart, BsHeartFill, BsFillTelephoneFill } from 'react-icons/bs';
import { MdEmail, MdEdit } from 'react-icons/md';
import { useState, MouseEvent, forwardRef } from 'react';
import styled from './styles.module.scss';
import { addLikeStore, deleteLikeStore } from '../../api/like';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useStoresData } from '../../contexts/findContext';
import { LoadingPlaceholder } from '../Loading';
// import MapModal from '../MapModal';

export type CardProps = {
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
	onClick?: (id: number) => void;
	onOpenMap?: Function;
	// lat?: number;
	// lng?: number;
};

const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
	{
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
		onClick,
		onOpenMap,
	}: // lat,
	// lng,
	CardProps,
	ref,
) {
	const { oneStore } = useStoresData();
	const [isStoreLiked, setIsStoreLiked] = useState(isLiked);
	// const [isMapOpen, setIsMapOpen] = useState(false);
	const navigate = useNavigate();
	const { pathname } = useLocation();

	// 新增或取消收藏場館
	const handleToggleLike = async (storeId: number) => {
		const storedData = localStorage.getItem('isport');
		let dataObject: { token?: string } = {};
		if (storedData) {
			dataObject = JSON.parse(storedData);
		}
		const authToken = dataObject.token;

		try {
			if (isStoreLiked) {
				// 取消收藏
				await deleteLikeStore(authToken || '', storeId);
			} else {
				// 新增收藏
				await addLikeStore(authToken || '', storeId);
			}
			setIsStoreLiked((preLiked) => !preLiked);
		} catch (error) {
			console.log(error);
		}
	};

	// 點擊單一場館跳轉頁面
	const handleCardClick = (e: MouseEvent<HTMLDivElement>) => {
		e.preventDefault();
		navigate(pathname.includes('/store/find') ? `/store/find/${id}` : `/find/${id}`);
		localStorage.setItem('oneStoreId', String(id));
	};

	// const handleMapClick = () => {
	// e.stopPropagation();
	// console.log(onOpenMap);
	// };

	return (
		<div className={styled.card} key={id} ref={ref}>
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
								<div
									className={styled.card__infoWrap__detailWrap__detail__map}
									onClick={() => {
										if (onOpenMap) {
											onOpenMap(id);
										}
									}}
								>
									<BiSolidMap className={styled['card__infoWrap__detailWrap__detail__map--logo']} />
									<span>Map</span>
								</div>

								<div className={styled['card__infoWrap__detailWrap__detail--rating']}>
									{rating ?? 0}
								</div>
								{/* google map */}
								{/* {isMapOpen && (
									<MapModal
										onClose={handleMapClick}
										storeName={storeName}
										lat={lat || 0}
										lng={lng || 0}
									/>
								)} */}

								<div className={styled['card__infoWrap__detailWrap__detail--review']}>
									{reviewCounts}則評論
								</div>
							</div>

							{/* 愛心收藏圖案功能 */}
							{pathname !== '/store/find' ? (
								<div onClick={() => handleToggleLike(id)}>
									{!isStoreLiked ? (
										<BsHeart style={{ fontSize: '24px' }} />
									) : (
										<BsHeartFill style={{ fontSize: '24px', color: 'red' }} />
									)}
								</div>
							) : (
								<MdEdit
									onClick={() => {
										if (onClick) {
											onClick(id);
										}
									}}
									style={{ fontSize: '24px' }}
								/>
							)}
						</div>

						<div className={styled['card__infoWrap--text']}>{introduction}</div>
					</>
				) : (
					// one store version
					<>
						{/* store-name */}
						<div className={styled['card__storeInfoWrap--title']}>
							<span>{storeName}</span>
							{/* 愛心收藏圖案功能 */}
							{!pathname.includes('/store/find') ? (
								<div onClick={() => handleToggleLike(id)}>
									{!isStoreLiked ? (
										<BsHeart style={{ fontSize: '24px' }} />
									) : (
										<BsHeartFill style={{ fontSize: '24px', color: 'red' }} />
									)}
								</div>
							) : (
								<MdEdit
									onClick={() => {
										if (onClick) {
											onClick(id);
										}
									}}
									style={{ fontSize: '24px' }}
								/>
							)}
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
					</>
				)}
			</div>
		</div>
	);
});

export function CardPlaceholder() {
	const { id } = useParams();
	const { pathname } = useLocation();
	return (
		<div className={styled.card} key={id}>
			<div className={styled.card__imgWrap}>
				<LoadingPlaceholder className={`${styled['card__imgWrap--img']} ${styled.placeholder}`} />
			</div>

			{/* info */}
			<div className={styled.card__infoWrap}>
				{!id ? (
					<>
						<LoadingPlaceholder className={styled['card__infoWrap--title']} />

						<div className={styled.card__infoWrap__detailWrap}>
							<div className={styled.card__infoWrap__detailWrap__detail}>
								<div className={styled.card__infoWrap__detailWrap__detail__map}>
									<BiSolidMap className={styled['card__infoWrap__detailWrap__detail__map--logo']} />
									<span>Map</span>
								</div>

								<div className={styled['card__infoWrap__detailWrap__detail--rating']}>0</div>

								<div className={styled['card__infoWrap__detailWrap__detail--review']}>
									{'0 '}則評論
								</div>
							</div>

							{pathname !== '/store/find' ? (
								<div>
									<BsHeart style={{ fontSize: '24px' }} />
								</div>
							) : (
								<MdEdit />
							)}
						</div>

						<LoadingPlaceholder
							className={`${styled['card__infoWrap--text']} ${styled.placeholder}`}
						/>
					</>
				) : (
					<>
						<div className={styled['card__storeInfoWrap--title']}>
							<LoadingPlaceholder />
							{!pathname.includes('/store/find') ? (
								<div>
									<BsHeart style={{ fontSize: '24px' }} />
								</div>
							) : (
								<MdEdit style={{ fontSize: '24px' }} />
							)}
						</div>

						<div className={styled['card__storeInfoWrap--address']}>
							<BiSolidMap className={styled['card__storeInfoWrap--addressIcon']} />
							<LoadingPlaceholder />
						</div>

						<div className={styled['card__storeInfoWrap--review']}>
							<span className={styled['card__storeInfoWrap--rating']}>0</span>
							<span>0則評論</span>
						</div>

						<LoadingPlaceholder />

						<div className={styled['card__storeInfoWrap--phone']}>
							<BsFillTelephoneFill className={styled['card__storeInfoWrap--phoneIcon']} />
							<LoadingPlaceholder />
						</div>

						<div className={styled['card__storeInfoWrap--email']}>
							<MdEmail className={styled['card__storeInfoWrap--emailIcon']} />
							<LoadingPlaceholder />
						</div>
					</>
				)}
			</div>
		</div>
	);
}

export default Card;
