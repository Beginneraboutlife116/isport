import { MdEdit } from 'react-icons/md';
import { RxCross1 } from 'react-icons/rx';
import Button from '../../Button';
import styles from './styles.module.scss';
import { DayClassType } from '../../../pages/OwnerStore/OwnerClasses';

export default function OwnerClass({
	weekday,
	eachDayClasses,
	openDeleteModal,
	openEditDialog,
}: {
	weekday: string;
	eachDayClasses: DayClassType[];
	openDeleteModal: (id: number) => void;
	openEditDialog: (id: number) => void;
}) {
	const week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
	return (
		<details className={styles.class} open key={weekday}>
			<summary className={styles.title}>{week[Number.parseInt(weekday, 10)]}</summary>
			{eachDayClasses.length === 0 ? (
				<p style={{ color: '#da1010' }}>場館無課表</p>
			) : (
				eachDayClasses.map(({ id, className, startTime, endTime, headcount }) => {
					return (
						<div className={styles.content} key={id}>
							<div>
								<p className={styles.content__name}>{className}</p>
								<p className={styles.content__time}>
									<span>{startTime}</span> ~ <span>{endTime}</span>
								</p>
							</div>
							<div className={styles.content__right}>
								<p>名額 {headcount} 人</p>
								<div>
									<Button onClick={() => openEditDialog(id as number)}>
										<MdEdit style={{ fontSize: '1.5rem' }} />
									</Button>
									<Button onClick={() => openDeleteModal(id as number)}>
										<RxCross1 style={{ fontSize: '1.5rem' }} />
									</Button>
								</div>
							</div>
						</div>
					);
				})
			)}
		</details>
	);
}
