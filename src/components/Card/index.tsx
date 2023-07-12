import { BiSolidMap } from 'react-icons/bi';
import { BsHeart } from 'react-icons/bs';
import { BsFillTelephoneFill } from 'react-icons/bs';
import { MdEmail } from 'react-icons/md';
import gym from '../../assets/Gym.jpg';
import { useState } from 'react';

import styled from './styles.module.scss';

type CardProps = {
	storeName: string;
	rating: number;
	reviewCounts: string;
	introduction: string;
};

function Card({ storeName, rating, reviewCounts, introduction }: CardProps) {
	const [store, setStore] = useState(true);
	setStore; //為了不報錯暫時放置
	return (
		<div className={styled.card}>
			<div className={styled.card__imgWrap}>
				<img src={gym} alt={storeName} className={styled['card__imgWrap--img']} />
			</div>

			{/* info */}
			<div className={styled.card__infoWrap}>
				{!store ? (
					// user page version
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

							<BsHeart style={{ fontSize: '24px' }} />
						</div>

						<div className={styled['card__infoWrap--text']}>{introduction}</div>
					</>
				) : (
					// store page version
					<div className={styled.card__storeInfoWrap}>
						{/* store-name */}
						<div className={styled['card__storeInfoWrap--title']}>
							<span>{storeName}</span>
							<BsHeart style={{ fontSize: '24px' }} />
						</div>

						{/* address */}
						<div className={styled['card__storeInfoWrap--address']}>
							<BiSolidMap className={styled['card__storeInfoWrap--addressIcon']} />
							<span>542南投縣草屯鎮虎山路819號2F</span>
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
							<span>02-1122-3344</span>
						</div>

						{/* email */}
						<div className={styled['card__storeInfoWrap--email']}>
							<MdEmail className={styled['card__storeInfoWrap--emailIcon']} />
							<span>gym@example.com</span>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default Card;
