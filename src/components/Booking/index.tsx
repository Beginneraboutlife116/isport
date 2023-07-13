import styled from './styles.module.scss';

function Booking() {
	return (
		<div className={styled.container}>
			{/* select plan */}
			<div className={styled.container__infoWrap}>
				<span className={styled['container__infoWrap--title']}>課堂名稱</span>
				<span>2023-06-25 (日) 15:00 ~ 16:00</span>
				<select name='plan' id='plan' className={styled['container__infoWrap--select']}>
					<option value=''>8堂方案(剩餘5堂)</option>
				</select>
			</div>

			{/* text */}
			{/* 可以改成 textarea */}
			<div>
				<input type='text' placeholder='預約備註' className={styled.container__input} />
			</div>

			{/* send button */}
			<div className={styled.container__buttonWrap}>
				<button className={styled.container__button}>送出預約</button>
			</div>
		</div>
	);
}

export default Booking;
