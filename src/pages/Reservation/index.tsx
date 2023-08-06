import ReservationList from '../../components/ReservationList';
import styled from './styles.module.scss';

function Reservation() {
	return (
		<div className='container pt-32'>
			<div className={styled.container__wrap}>
				<ReservationList />
			</div>
		</div>
	);
}

export default Reservation;
