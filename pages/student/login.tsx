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
import PublicLayout from '@/layouts/PublicLayout';

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

	const handleAuth = () => {
		signInWithRedirect(auth, provider);
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
				const docRef = doc(db, 'students', user.email!);
				const docSnap = await getDoc(docRef);
				const data = docSnap.data();
				if (docSnap.exists() && data?.regNo !== null) {
					await axios.post<AxiosBaseResponse>('/api/student/login', {
						email: user.email,
						token,
					});
					router.push(`/student/${data?.regNo}`);
				} else {
					router.push('/student/register');
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
				await signOut(auth);
			} finally {
				dispatch(showLoading(false));
			}
		};

		handleGoogleRedirectAuth();
	}, []);

	return (
		<>
			<Head>
				<title>Student Login</title>
			</Head>
			<PublicLayout>
				<button onClick={handleAuth}>
					Login with Google (use srm email)
				</button>
				{error.error && <p className='text-red-500'>{error.message}</p>}
			</PublicLayout>
		</>
	);
};

export default StudentLoginPage;

export const getServerSideProps = withSessionSsr(
	async function getServerSideProps({ req }) {
		const user = req.session.user;
		if (user?.email) {
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
