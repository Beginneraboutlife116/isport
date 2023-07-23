import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { isAxiosError } from '../../../util/helpers';
import { getStoreReviews } from '../../../api/owner';
import styles from '../styles.module.scss';
import { ReviewItem, ItemProps } from '../../../components/Review';

export default function OwnerReviews() {
	const { storeId } = useParams();
	const [reviews, setReviews] = useState<ItemProps[]>([]);
	const [noDataMessage, setNoDataMessage] = useState<string>();

	useEffect(() => {
		async function fetchReviews() {
			try {
				const response = await getStoreReviews(Number.parseInt(storeId as string, 10));
				if (response.status === 200) {
					setReviews(response.data);
				}
			} catch (error) {
				if (isAxiosError(error)) {
					setNoDataMessage(error.response?.data.message);
				} else {
					console.error(error);
				}
			}
		}

		fetchReviews();
	}, [storeId]);

	return (
		<section className={styles.section}>
			{noDataMessage ? (
				<p className={styles.noData} style={{ marginBlockStart: '65.5px' }}>
					{noDataMessage}
				</p>
			) : (
				reviews.map((review) => <ReviewItem key={review.id} {...review} />)
			)}
		</section>
	);
}
