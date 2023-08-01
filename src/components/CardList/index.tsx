import Card from '../Card';
import styled from './styles.module.scss';

export type CardData = {
	id: number;
	storeName: string;
	photo: string;
	address: string;
	rating: number;
	reviewCounts: number;
	introduction: string;
	isLiked?: boolean;
	// lat: number;
	// lng: number;
};

type CardListProps = {
	data: CardData[];
	handleClick?: (id: number) => void;
	handleOpenMap?: Function;
};

function CardList({ data, handleClick, handleOpenMap }: CardListProps) {
	return (
		<div className={styled.container}>
			{data.map((item) => {
				return (
					<Card
						key={item.id}
						id={item.id}
						storeName={item.storeName}
						rating={item.rating}
						reviewCounts={item.reviewCounts}
						introduction={item.introduction}
						photo={item.photo}
						isLiked={item.isLiked}
						onClick={handleClick}
						onOpenMap={handleOpenMap}
						// lat={item.lat}
						// lng={item.lng}
					/>
				);
			})}
		</div>
	);
}

export default CardList;
