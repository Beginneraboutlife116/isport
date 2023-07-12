import styled from './styles.module.scss';

type setStatus = React.Dispatch<React.SetStateAction<string>>;

type propType = {
	setStatus: setStatus;
};

function CourseInfo({ setStatus }: propType) {
	function handleBooking() {
		setStatus('booking');
	}

	return (
		<div className={styled.container__infoWrap}>
			<div className={styled['container__infoWrap--title']}>
				<span className={styled['container__infoWrap--text']}>課程名稱</span>
				<span>15:00 - 16:00</span>

				{/* 根據狀態顯示或不顯示 */}
				<div className={styled['container__infoWrap--deadLine']}>已截止</div>
			</div>

			<div>
				{/* 根據狀態顯示不同樣式 */}
				<button className={styled['container__infoWrap--button']} onClick={handleBooking}>
					預約
				</button>
			</div>
		</div>
	);
}

function Course({ setStatus }: propType) {
	return (
		<div className={styled.container}>
			<div>
				<div className={styled.container__date}>
					<span>6/25 (日)</span>
				</div>

				<CourseInfo setStatus={setStatus} />
				<CourseInfo setStatus={setStatus} />
				<CourseInfo setStatus={setStatus} />
			</div>
		</div>
	);
}

export default Course;
