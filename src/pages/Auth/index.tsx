import { Outlet } from 'react-router-dom';
import styles from './styles.module.scss';
import LoginPage from './Login';
import SignupStepOnePage from './Signup/StepOne';
import SignupStepTwoPage from './Signup/StepTwo';
import StoreLoginPage from './Store/Login';
import StoreSignupPage from './Store/Signup';

function UserAuthPage() {
	return (
		<main className={styles.auth}>
			<Outlet />
		</main>
	);
}

export {
	UserAuthPage,
	LoginPage,
	SignupStepOnePage,
	SignupStepTwoPage,
	StoreLoginPage,
	StoreSignupPage,
};
