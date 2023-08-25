import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { isAxiosError } from '../../../util/helpers';
import { getStoreReviews } from '../../../api/owner';
import { ReviewItem, ItemProps, ReviewPlaceholder } from '../../../components/Review';
import useIntersectionObserver from '../../../util/useIntersectionObserver';
import styles from '../styles.module.scss';

export default function OwnerReviews() {
	const { storeId } = useParams();
	const [reviews, setReviews] = useState<ItemProps[]>([]);
	const [noDataMessage, setNoDataMessage] = useState<string>();
	const [isPending, setIsPending] = useState(false);
	const REVIEWS_PER_PAGE = 4;
	const [reviewsPage, setReviewsPage] = useState(0);
	const [hasMoreReviews, setHasMoreReviews] = useState(true);
	const sectionRef = useRef<HTMLDivElement>(null);
	const [hasMounted, setHasMounted] = useState<boolean>(false);
	const lastReviewRef = useIntersectionObserver(
		(entries) => {
			if (entries[0].isIntersecting && hasMoreReviews) {
				setReviewsPage(reviewsPage + 1);
			}
		},
		{ root: sectionRef.current, rootMargin: '10px', threshold: 1 },
		hasMounted,
	);

	useEffect(() => {
		async function fetchReviews() {
			try {
				setIsPending(true);
				const response = await getStoreReviews(
					Number.parseInt(storeId as string, 10),
					reviewsPage,
					REVIEWS_PER_PAGE,
				);
				if (response.status === 200) {
					setReviews([...reviews, ...response.data]);
					if (response.data.length < REVIEWS_PER_PAGE) {
						setHasMoreReviews(false);
					}
				}
			} catch (error) {
				if (isAxiosError(error)) {
					if (!reviews.length) {
						setNoDataMessage(error.response?.data.message);
					} else {
						setHasMoreReviews(false);
					}
				} else {
					console.error(error);
				}
			} finally {
				setIsPending(false);
			}
		}

		fetchReviews();
	}, [storeId, reviewsPage, REVIEWS_PER_PAGE]);

	useEffect(() => {
		setHasMounted(!isPending && !noDataMessage);
	}, [isPending, noDataMessage]);

	return (
		<section className={styles.section} ref={sectionRef}>
			{noDataMessage ? (
				<p className={styles.noData} style={{ marginBlockStart: '65.5px' }}>
					{noDataMessage}
				</p>
			) : (
				reviews.map((review, index) => {
					if ((index + 1) % (REVIEWS_PER_PAGE * (reviewsPage + 1)) === 0) {
						return <ReviewItem key={review.id} {...review} ref={lastReviewRef} />;
					} else {
						return <ReviewItem key={review.id} {...review} />;
					}
				})
			)}
			{isPending ? (
				reviews.length ? (
					<ReviewPlaceholder />
				) : (
					new Array(REVIEWS_PER_PAGE)
						.fill(null)
						.map(() => <ReviewPlaceholder key={crypto.randomUUID()} />)
				)
			) : null}
		</section>
	);
}
