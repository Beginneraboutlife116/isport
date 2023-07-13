import { BsFillPersonFill } from 'react-icons/bs';
import UpperForm from './UpperForm';
import BottomForm from './BottomForm';
import styles from './styles.module.scss';

export default function MyAccountPage() {
	return (
		<>
			<div className={styles['border-bottom']}>
				<section className={styles.section}>
					<h3 className={styles.section__title}>
						<BsFillPersonFill /> 基本資料
					</h3>
					<UpperForm />
				</section>
			</div>
			<section className={styles.section}>
				<h3 className={styles.section__title}>修改資料</h3>
				<BottomForm />
			</section>
		</>
	);
}
