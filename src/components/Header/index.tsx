import styles from './styles.module.scss';
import logo from '../../assets/Logo.png';
import { Link } from 'react-router-dom';

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
					<img src={logo} alt='isport logo' className={styles.header__logo__width} />
					<h1>愛運動</h1>
				</div>

				{/* auth = user */}
				{/* button */}
				<div className={styles.header__linkWrap}>
					<Link to='/find' className={styles.header__linkWrap__link}>
						找場館
					</Link>

					<Link to='/collection' className={styles.header__linkWrap__link}>
						我的場館
					</Link>

					<Link to='/reservation' className={styles.header__linkWrap__link}>
						我的預約
					</Link>
				</div>

				<div>我的帳戶</div>

				<div>登出</div>

				{/* auth = owner */}
				{children}
			</div>
		</header>
	);
}
