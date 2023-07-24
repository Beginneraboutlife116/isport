import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { isAxiosError } from '../../../util/helpers';
import { getStoreReviews } from '../../../api/owner';
import { ReviewItem, ItemProps } from '../../../components/Review';
import Loading from '../../../components/Loading';
import styles from '../styles.module.scss';

export default function OwnerReviews() {
	const { storeId } = useParams();
	const [reviews, setReviews] = useState<ItemProps[]>([]);
	const [noDataMessage, setNoDataMessage] = useState<string>();
	const [isPending, setIsPending] = useState(false);

	useEffect(() => {
		async function fetchReviews() {
			try {
				setIsPending(true);
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
			} finally {
				setIsPending(false);
			}
		}

		fetchReviews();
	}, [storeId]);

	return (
		<section className={styles.section}>
			{isPending ? (
				<Loading />
			) : noDataMessage ? (
				<p className={styles.noData} style={{ marginBlockStart: '65.5px' }}>
					{noDataMessage}
				</p>
			) : (
				reviews.map((review) => <ReviewItem key={review.id} {...review} />)
			)}
		</section>
	);
}
