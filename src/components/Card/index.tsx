import { BiSolidMap } from 'react-icons/bi';
import { BsHeart } from 'react-icons/bs';
import gym from '../../assets/Gym.jpg';

import styled from './styles.module.scss';

type CardProps = {
	storeName: string;
	rating: number;
	reviewCounts: string;
	introduction: string;
};

function Card({ storeName, rating, reviewCounts, introduction }: CardProps) {
	return (
		<div className={styled.card}>
			<div className={styled.card_imgWrap}>
				<img src={gym} alt={storeName} className={styled.card_imgWrap_img} />
			</div>

			{/* info */}
			<div className={styled.card_infoWrap}>
				<span className={styled.card_infoWrap_title}>{storeName}</span>

				<div className={styled.card_infoWrap_detailWrap}>
					<div className={styled.card_infoWrap_detailWrap_detail}>
						<div className={styled.card_infoWrap_detailWrap_detail_map}>
							<BiSolidMap className={styled.card_infoWrap_detailWrap_detail_map_logo} />
							<span>Map</span>
						</div>

						<div className={styled.card_infoWrap_detailWrap_detail_rating}>{rating}</div>

						<div className={styled.card_infoWrap_detailWrap_detail_review}>
							{reviewCounts}則評論
						</div>
					</div>

					<BsHeart style={{ fontSize: '24px' }} />
				</div>

				<div className={styled.card_infoWrap_text}>{introduction}</div>
			</div>
		</div>
	);
}

export default Card;

// const Card = ({ title, description, image }) => {
//   return (
//     <div className="card">
//       <img src={image} alt={title} className="card-image" />
//       <div className="card-content">
//         <h3 className="card-title">{title}</h3>
//         <p className="card-description">{description}</p>
//       </div>
//     </div>
//   );
// };
