import styled from './styles.module.scss';

type InfoProps = {
	setStatus: React.Dispatch<React.SetStateAction<string>>;
	id: number;
	className: string;
	startTime: string;
	endTime: string;
	isClosed: boolean;
	isReserved: boolean;
	weekDay?: string;
};

type DateProps = {
	date: string;
	weekDay?: string;
};

type CourseProps = {
	setStatus: React.Dispatch<React.SetStateAction<string>>;
	data: Record<string, InfoProps[]>;
};

function CourseInfo({
	setStatus,
	className,
	startTime,
	endTime,
	isClosed,
	isReserved,
	id,
}: InfoProps) {
	function handleBooking() {
		setStatus('booking');
	}

	return (
		<div className={styled.container__infoWrap} key={id}>
			<div className={styled['container__infoWrap--title']}>
				<span className={styled['container__infoWrap--text']}>{className}</span>
				<span>{`${startTime} ~ ${endTime}`}</span>

				{/* 根據狀態顯示或不顯示 */}
				{!isClosed ? '' : <div className={styled['container__infoWrap--deadLine']}>已截止</div>}
			</div>

			<div>
				{/* 根據狀態顯示不同樣式 */}
				{!isReserved ? (
					<button className={styled['container__infoWrap--button']} onClick={handleBooking}>
						預約
					</button>
				) : (
					<button className={styled['container__infoWrap--redButton']}>已預約</button>
				)}
			</div>
		</div>
	);
}

function Date({ date, weekDay }: DateProps) {
	return (
		<div className={styled.container__date}>
			<span>
				{date}({weekDay})
			</span>
		</div>
	);
}

function Course({ setStatus, data }: CourseProps) {
	return (
		<div className={styled.container}>
			{Object.entries(data).map(([date, data]) => (
				<div key={date}>
					<Date date={date} weekDay={data[0].weekDay} />
					{data.map((item) => (
						<CourseInfo
							setStatus={setStatus}
							key={item.id}
							className={item.className}
							startTime={item.startTime}
							endTime={item.endTime}
							isClosed={item.isClosed}
							isReserved={item.isReserved}
							id={item.id}
						/>
					))}
				</div>
			))}
		</div>
	);
}

export default Course;
