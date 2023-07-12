import { useState } from 'react';
import Card from '../../components/Card';
import styled from './styles.module.scss';
import Course from '../../components/Course';
import Plan from '../../components/Plan';
import Review from '../../components/Review';
import Booking from '../../components/Booking';

const data = {
	id: 1,
	storeName: 'xx運動館',
	photo: '0',
	address: '住址',
	rating: 9.8,
	reviewCounts: '1,000',
	introduction:
		'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vel unde quidem mollitia! Quidem totam esse alias? Non officiis sit asperiores distinctio eaque veritatis doloribus consectetur. Voluptates ex modi architecto mollitia!',
	isLiked: false,
};

function Store() {
	const [status, setStatus] = useState<string>('course');

	function handleStatus(text: string) {
		setStatus(text);
	}

	return (
		<div className={styled.container}>
			<div className={styled.container__wrap}>
				<Card
					storeName={data.storeName}
					rating={data.rating}
					reviewCounts={data.reviewCounts}
					introduction={data.introduction}
				/>

				{/* status */}
				<div className={styled.container__status}>
					{status === 'booking' ? (
						''
					) : (
						<div className={styled.container__titleWrap}>
							<span
								className={styled['container__titleWrap--title']}
								onClick={() => handleStatus('course')}
								style={{ color: status === 'course' ? 'rgb(10, 186, 245)' : 'black' }}
							>
								課程
							</span>
							<span
								className={styled['container__titleWrap--title']}
								onClick={() => handleStatus('plan')}
								style={{ color: status === 'plan' ? 'rgb(10, 186, 245)' : 'black' }}
							>
								方案
							</span>
							<span
								className={styled['container__titleWrap--title']}
								onClick={() => handleStatus('review')}
								style={{ color: status === 'review' ? 'rgb(10, 186, 245)' : 'black' }}
							>
								評價
							</span>
						</div>
					)}

					{/* status component */}
					<div className={styled.container__infoWrap}>
						{status === 'course' && <Course setStatus={setStatus} />}

						{status === 'plan' && <Plan />}

						{status === 'review' && <Review />}

						{status === 'booking' && <Booking />}
					</div>
				</div>
			</div>
		</div>
	);
}

export default Store;
