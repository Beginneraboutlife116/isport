import styles from './styles.module.scss';
import { Link, Outlet, useLocation, useParams } from 'react-router-dom';
import MyAccountPage from './MyAccount';
import MyPlanPage from './MyPlan';

function UserInfoPage() {
	const { pathname } = useLocation();
	const { id: userId } = useParams();

	return (
		<main className={styles.container}>
			<h1 className='hidden'>我的帳戶資訊</h1>
			<div className={styles.header}>
				<Link
					to={`/user/${userId}`}
					className={`${styles.header__title} ${
						pathname === `/user/${userId}` ? styles.currentElement : ''
					}`.trim()}
				>
					<h2>我的帳戶</h2>
				</Link>
				<Link
					to='./plan'
					className={`${styles.header__title} ${
						pathname === `/user/${userId}/plan` ? styles.currentElement : ''
					}`.trim()}
				>
					<h2>我的方案</h2>
				</Link>
			</div>
			<div>
				<Outlet />
			</div>
		</main>
	);
}

export { UserInfoPage, MyAccountPage, MyPlanPage };
