import { MdEdit } from 'react-icons/md';
import { RxCross1 } from 'react-icons/rx';
import Button from '../Button';
import styles from './styles.module.scss';
import { DayClassesType } from '../../pages/OwnerStore';

export default function OwnerClass({
	weekday,
	eachDayClasses,
	handleDelete,
}: {
	weekday: string;
	eachDayClasses: DayClassesType[];
	handleDelete: Function;
}) {
	const week = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
	return (
		<details className={styles.class} open>
			<summary className={`${styles.title}`.trim()}>{week[Number.parseInt(weekday, 10)]}</summary>
			{eachDayClasses.map(({ id, className, startTime, endTime, headCount }) => {
				return (
					<div className={styles.content} key={id}>
						<div>
							<p className={styles.content__name}>{className}</p>
							<p className={styles.content__time}>
								<span>{startTime}</span> ~ <span>{endTime}</span>
							</p>
						</div>
						<div className={styles.content__right}>
							<p>名額 {headCount} 人</p>
							<div>
								<Button>
									<MdEdit style={{ fontSize: '1.5rem' }} />
								</Button>
								<Button onClick={() => handleDelete(id)}>
									<RxCross1 style={{ fontSize: '1.5rem' }} />
								</Button>
							</div>
						</div>
					</div>
				);
			})}
		</details>
	);
}
