import React, { useEffect, useState } from 'react';
import {
	getAuth,
	signInWithRedirect,
	GoogleAuthProvider,
	getRedirectResult,
	signOut,
} from 'firebase/auth';
import { app } from '@/firebase';
import { withSessionSsr } from '@/utils/withSession';
import axios, { AxiosError } from 'axios';
import Head from 'next/head';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAppDispatch } from '@/hooks/hooks';
import { showLoading } from '@/store/features/app';
import { useRouter } from 'next/router';

const provider = new GoogleAuthProvider();
const auth = getAuth(app);

const StudentLoginPage = () => {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const [error, setError] = useState({
		error: false,
		message: '',
	});

	const handleError = (message: string) => {
		setError({
			error: true,
			message,
		});
	};

	useEffect(() => {
		const handleGoogleRedirectAuth = async () => {
			dispatch(showLoading(true));
			const result = await getRedirectResult(auth);
			try {
				if (result === null) return;
				const credential =
					GoogleAuthProvider.credentialFromResult(result);
				const token = credential!.accessToken;
				const user = result.user;
				const response = await axios.post<StudentLoginRequest>(
					'/api/student/login',
					{
						email: user.email,
						token,
					}
				);
				switch (response.data.message) {
					case 'student/login-successful': {
						const docRef = doc(db, 'students', user.email!);
						const docSnap = await getDoc(docRef);
						const data = docSnap.data();
						router.push(`/student/${data?.regNo}`);
						break;
					}
					case 'student/onboard-redirect': {
						router.push('/student/register');
						break;
					}
				}
			} catch (error) {
				if (error instanceof AxiosError) {
					switch (error.response?.data.message) {
						case 'student/invalid-email-type': {
							handleError(
								'Email given is invalid or not an SRM email!'
							);
							break;
						}
						case 'app/internal-server-error': {
							handleError(
								'Something went wrong, try again later!'
							);
							break;
						}
					}
				}
				console.log(error);
				await signOut(auth);
			} finally {
				dispatch(showLoading(false));
			}
		};

		handleGoogleRedirectAuth();
	}, []);

	const handleAuth = () => {
		signInWithRedirect(auth, provider);
	};

	return (
		<>
			<Head>
				<title>Student Login</title>
			</Head>
			<div>
				<button onClick={handleAuth}>
					Login with Google (use srm email)
				</button>
				{error.error && <p className='text-red-500'>{error.message}</p>}
			</div>
		</>
	);
};

export default StudentLoginPage;

export const getServerSideProps = withSessionSsr(
	async function getServerSideProps({ req }) {
		const user = req.session.user;
		if (user?.token) {
			const docRef = doc(db, 'students', user.email!);
			const docSnap = await getDoc(docRef);
			const data = docSnap.data();
			return {
				redirect: {
					destination: `/student/${data?.regNo}`,
					permanent: true,
				},
			};
		}
		return {
			props: {},
		};
	}
);
