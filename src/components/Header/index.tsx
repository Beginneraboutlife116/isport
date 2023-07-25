import styles from './styles.module.scss';
import logo from '../../assets/logo.png';
import { Link } from 'react-router-dom';
import { IconContext } from 'react-icons';
import { BiSolidUserCircle } from 'react-icons/bi';
import Button from '../Button';

export default function Header({
	className,
	role,
	avatar,
	onLogout,
}: {
	className?: string;
	role: string;
	avatar: string;
	onLogout: () => void;
}) {
	return (
		<header className={`${styles.header} ${className ?? ''}`.trim()}>
			<div className={styles.header__wrapper}>
				<div className={styles.header__logo}>
					<img src={logo} alt='isport logo' />
				</div>

				<div className={styles.header__linkWrap}>
					{role && (
						<Link to={`/${role !== 'user' ? 'store/' : ''}find`}>
							<Button className={styles.header__linkWrap__link}>找場館</Button>
						</Link>
					)}

					{role === 'user' && (
						<Link to='/collection'>
							<Button className={styles.header__linkWrap__link}>我的場館</Button>
						</Link>
					)}

					{role === 'user' && (
						<Link to='/reservation'>
							<Button className={styles.header__linkWrap__link}>我的預約</Button>
						</Link>
					)}
				</div>

				{role && (
					<>
						{role === 'user' && (
							<Link to={`/user/account`}>
								<Button aria-label='修改大頭照' className={styles.header__btn}>
									{avatar ? (
										<img src={avatar} alt='大頭照' className={styles.header__avatar} />
									) : (
										<IconContext.Provider value={{ size: '2.2rem' }}>
											<BiSolidUserCircle />
										</IconContext.Provider>
									)}
								</Button>
							</Link>
						)}
						<Link to={`/${role === 'user' ? 'user' : 'store'}/account`}>
							<Button className={styles.header__btn}>我的帳戶</Button>
						</Link>

						<Button className={styles.header__btn} onClick={onLogout}>
							登出
						</Button>
					</>
				)}
			</div>
		</header>
	);
}
