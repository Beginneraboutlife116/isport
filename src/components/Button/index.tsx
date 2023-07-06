import React from 'react';
import styles from './styles.module.scss';

type ButtonElementProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ className, children, ...props }: ButtonElementProps) {
	return (
		<button {...props} className={`${styles.btn} ${className ?? ''}`.trim()}>
			{children}
		</button>
	);
}
