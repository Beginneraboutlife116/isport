import { ReactNode, SetStateAction, createContext, useContext, useState, Dispatch } from 'react';

type AuthContextProps = {
	token: string;
	setToken: Dispatch<SetStateAction<string>>;
	role: string;
	setRole: Dispatch<SetStateAction<string>>;
	userId: number;
	setUserId: Dispatch<SetStateAction<number>>;
	avatar: string;
	setAvatar: Dispatch<SetStateAction<string>>;
};

const AuthContext = createContext<AuthContextProps | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [token, setToken] = useState('');
	const [role, setRole] = useState('');
	const [userId, setUserId] = useState(0);
	const [avatar, setAvatar] = useState('');
	return (
		<AuthContext.Provider
			value={{ token, setToken, role, setRole, userId, setUserId, avatar, setAvatar }}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth 必須在有 AuthProvider 的內層使用');
	}
	return context;
}
