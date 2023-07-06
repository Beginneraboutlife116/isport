import styles from './styles.module.scss';

export default function Header({ children }: { children?: React.ReactNode }) {
	return (
		<header className={styles.header}>
			<div className={styles.header__wrapper}>
				<div className={styles.header__logo}>
					<img src='' alt='isport logo' />
					<h1>愛運動</h1>
				</div>
				{children}
			</div>
		</header>
	);
}
