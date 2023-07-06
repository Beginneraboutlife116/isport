import styles from './styles.module.scss';

export default function Header({
	children,
	className,
}: {
	children?: React.ReactNode;
	className?: string;
}) {
	return (
		<header className={`${styles.header} ${className ?? ''}`.trim()}>
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
