import styles from './styles.module.scss';

export default function Loading() {
	return (
		<div className={styles.container}>
			<div className={styles.wrapper}>
				<div className={styles.dumbbell}>
					<div className={styles.dumbbell__left}></div>
					<div className={styles.dumbbell__middle}></div>
					<div className={styles.dumbbell__right}></div>
				</div>
				<div className={styles.dumbbell} data-green>
					<div className={styles.dumbbell__left}></div>
					<div className={styles.dumbbell__middle}></div>
					<div className={styles.dumbbell__right}></div>
				</div>
			</div>
		</div>
	);
}
