import { Link } from 'react-router-dom';
import styles from './styles.module.scss';

export default function ErrorPage() {
	return (
		<main className={styles.container}>
			<h1 className={styles.title}>Oops!</h1>
			<p>發生了一些錯誤</p>
			<p>請點擊下方的連結回到首頁</p>
			<Link to='/' className={styles.link}>回到首頁</Link>
		</main>
	);
}
