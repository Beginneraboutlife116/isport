import Card from '../Card';
import styled from './styles.module.scss';

type CardData = {
	id: number;
	storeName: string;
	photo: string;
	address: string;
	rating: number;
	reviewCounts: number;
	introduction: string;
	isLiked?: boolean;
};

type CardListProps = {
	data: CardData[];
};

function CardList({ data }: CardListProps) {
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
					/>
				);
			})}
		</div>
	);
}

export default CardList;
