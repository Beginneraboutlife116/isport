import styled from './styles.module.scss';

function CourseInfo() {
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
				<button className={styled['container__infoWrap--button']}>預約</button>
			</div>
		</div>
	);
}

function Course() {
	return (
		<div className={styled.container}>
			<div>
				<div className={styled.container__date}>
					<span>6/25 (日)</span>
				</div>

				<CourseInfo />
				<CourseInfo />
				<CourseInfo />
			</div>

			<div>
				<div className={styled.container__date}>
					<span>6/25 (日)</span>
				</div>

				<CourseInfo />
				<CourseInfo />
				<CourseInfo />
			</div>
		</div>
	);
}

export default Course;
