import Card from '../Card';
import styled from './styles.module.scss';

type CardData = {
	id: number;
	storeName: string;
	photo: string;
	address: string;
	rating: number;
	reviewCounts: string;
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
						storeName={item.storeName}
						rating={item.rating}
						reviewCounts={item.reviewCounts}
						introduction={item.introduction}
					/>
				);
			})}
		</div>
	);
}

export default CardList;
