import { Outlet } from 'react-router-dom';
import styles from './styles.module.scss';
import LoginPage from './Login';
import SignupStepOnePage from './Signup/StepOne';
import SignupStepTwoPage from './Signup/StepTwo';

function UserAuthPage() {
	return (
		<main className={styles.auth}>
			<Outlet />
		</main>
	);
}

export { UserAuthPage, LoginPage, SignupStepOnePage, SignupStepTwoPage };