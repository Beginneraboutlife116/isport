import styles from './styles.module.scss';
import { Link, Outlet, useLocation } from 'react-router-dom';
import MyAccountPage from './MyAccount';
import MyPlanPage from './MyPlan';

function UserInfoPage() {
	const { pathname } = useLocation();

	return (
		<main className='container pt-32'>
			<h1 className='hidden'>我的帳戶資訊</h1>
			<div className={styles.header}>
				<Link
					to={`./account`}
					className={`${styles.header__title} ${
						pathname === `/user/account` ? styles.currentElement : ''
					}`.trim()}
				>
					<h2>我的帳戶</h2>
				</Link>
				<Link
					to='./plan'
					className={`${styles.header__title} ${
						pathname === `/user/plan` ? styles.currentElement : ''
					}`.trim()}
				>
					<h2>我的方案</h2>
				</Link>
			</div>
			<div className={styles.content}>
				<Outlet />
			</div>
		</main>
	);
}

export { UserInfoPage, MyAccountPage, MyPlanPage };
