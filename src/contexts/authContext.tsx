import { ReactNode, SetStateAction, createContext, useContext, useState, Dispatch } from 'react';

type AuthType = {
	token: string;
	role: string;
	userId: 0;
	avatar: string;
	isAuthenticated: boolean;
};

type AuthContextProps = [AuthType, Dispatch<SetStateAction<AuthType>>];

const AuthContext = createContext<AuthContextProps | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [auth, setAuth] = useState<AuthType>({
		token: '',
		role: '',
		userId: 0,
		avatar: '',
		isAuthenticated: false,
	});

	return <AuthContext.Provider value={[auth, setAuth]}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth 必須在有 AuthProvider 的內層使用');
	}
	return context;
}
