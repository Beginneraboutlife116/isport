import styles from './styles.module.scss';

export default function Loading() {
	return (
		<div className={styles.container}>
			<div className={styles.wrapper}>
				<div>
					<div></div>
					<div></div>
					<div></div>
				</div>
				<img src='/src/assets/logo-word.png' alt='logo' />
			</div>
		</div>
	);
}
