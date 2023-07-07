import ReservationList from '../../components/ReservationList';
import styled from './styles.module.scss';

function Reservation() {
	return (
		<div className={styled.container}>
			<div className={styled.container__wrap}>
				<ReservationList />
			</div>
		</div>
	);
}

export default Reservation;
