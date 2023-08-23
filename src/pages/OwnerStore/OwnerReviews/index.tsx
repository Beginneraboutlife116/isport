import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { isAxiosError } from '../../../util/helpers';
import { getStoreReviews } from '../../../api/owner';
import { ReviewItem, ItemProps, ReviewPlaceholder } from '../../../components/Review';
import styles from '../styles.module.scss';

export default function OwnerReviews() {
	const { storeId } = useParams();
	const [reviews, setReviews] = useState<ItemProps[]>([]);
	const [noDataMessage, setNoDataMessage] = useState<string>();
	const [isPending, setIsPending] = useState(false);
	const observerRef = useRef<IntersectionObserver>();
	const sectionRef = useRef<HTMLDivElement>(null);
	const lastReviewRef = useRef<HTMLDivElement>(null);
	const reviewsPerPage = 5;
	const [reviewsPage, setReviewsPage] = useState(0);
	const [hasMoreReviews, setHasMoreReviews] = useState(true);

	useEffect(() => {
		async function fetchReviews() {
			try {
				setIsPending(true);
				const response = await getStoreReviews(
					Number.parseInt(storeId as string, 10),
					reviewsPage,
					reviewsPerPage,
				);
				if (response.status === 200) {
					if (reviews.length) {
						setReviews([...reviews, ...response.data]);
						if (response.data.length < reviewsPerPage) {
							setHasMoreReviews(false);
						}
					} else {
						setReviews(response.data);
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
	}, [storeId, reviewsPage, reviewsPerPage]);

	useEffect(() => {
		if (!isPending && !noDataMessage) {
			if (window) {
				if (sectionRef.current && lastReviewRef.current) {
					const options = {
						root: sectionRef.current,
						rootMargin: '0px',
						threshold: 0,
					};
					observerRef.current = new IntersectionObserver((entries) => {
						if (entries[0].isIntersecting && hasMoreReviews) {
							setReviewsPage(reviewsPage + 1);
						}
					}, options);
					observerRef.current.observe(lastReviewRef.current);
				}
			}
		}
		return () => {
			observerRef.current?.disconnect();
		};
	}, [isPending, noDataMessage]);

	return (
		<section className={styles.section} ref={sectionRef}>
			{noDataMessage ? (
				<p className={styles.noData} style={{ marginBlockStart: '65.5px' }}>
					{noDataMessage}
				</p>
			) : (
				reviews.map((review, index) => {
					if (index % (reviewsPerPage - 1) === 0) {
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
					new Array(reviewsPerPage)
						.fill(null)
						.map(() => <ReviewPlaceholder key={crypto.randomUUID()} />)
				)
			) : null}
		</section>
	);
}
