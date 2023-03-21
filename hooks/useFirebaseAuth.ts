import { useState, useEffect } from 'react';
import { app } from '@/firebase';
import { getAuth, NextOrObserver, User } from 'firebase/auth';
import { useAppDispatch, useAppSelector } from './hooks';
import axios from 'axios';
import { useRouter } from 'next/router';
import { logoutStudent } from '@/store/features/student';

interface FirebaseAuthHookOptions {
	redirect?: boolean;
}

const defaultOptions = {
	redirect: false,
};

export default function useFirebaseAuth(options: FirebaseAuthHookOptions) {
	options = defaultOptions;
	const router = useRouter();
	const dispatch = useAppDispatch();
	const { student } = useAppSelector((state) => state.student);

	const auth = getAuth(app);

	const authStateChanged: NextOrObserver<User> = async (authState) => {
		if (!authState) {
			await axios.post('/api/student/logout');
			dispatch(logoutStudent());
			if (options?.redirect) {
				router.push('/student/login');
			}
		}
	};

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(authStateChanged);
		return () => unsubscribe();
	}, []);

	return {
		student,
	};
}
