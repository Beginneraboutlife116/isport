import { MdEdit } from 'react-icons/md';
import { RxCross1 } from 'react-icons/rx';
import Button from '../../Button';
import styles from './styles.module.scss';

export default function OwnerCourse() {
	const weekday = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
	return (
		<details className={styles.course} open>
			<summary className={`${styles.title}`.trim()}>{weekday[0]}</summary>
			<div className={styles.content}>
				<div>
					<p className={styles.content__name}>課程名稱</p>
					<p className={styles.content__time}>
						<span>15:00</span> ~ <span>16:00</span>
					</p>
				</div>
				<div className={styles.content__right}>
					<p>名額</p>
					<div>
						<Button>
							<MdEdit style={{ fontSize: '1.5rem' }} />
						</Button>
						<Button>
							<RxCross1 style={{ fontSize: '1.5rem' }} />
						</Button>
					</div>
				</div>
			</div>
		</details>
	);
}
