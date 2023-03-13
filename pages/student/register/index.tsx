import { app, db } from '@/firebase';
import { withSessionSsr } from '@/utils/withSession';
import {
	getAuth,
	getRedirectResult,
	GoogleAuthProvider,
	signInWithRedirect,
	signOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '@/hooks/hooks';
import { showLoading } from '@/store/features/app';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { AppRegEx } from '@/config';
import Head from 'next/head';

const provider = new GoogleAuthProvider();
const auth = getAuth(app);

const StudentRegisterPage = () => {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const [error, setError] = useState({
		error: false,
		message: '',
	});
	const handleAuth = () => {
		signInWithRedirect(auth, provider);
	};

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
					if (!AppRegEx.studentCollegeEmail.test(user.email!)) {
						handleError(
							'Email given is invalid or not an SRM email!'
						);
						return;
					}
					await setDoc(doc(db, 'students', user.email!), {
						name: user.displayName,
						avatar: user.photoURL,
						email: user.email,
						phone: user.phoneNumber,
						regNo: null,
					});
					router.push({
						pathname: '/student/register/onboard',
						query: {
							email: user.email,
							phone: user.phoneNumber,
							name: user.displayName,
						},
					});
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

	return (
		<>
			<Head>
				<title>Student Registration</title>
			</Head>
			<div>
				<button onClick={handleAuth}>
					Signup with google (using srm email)
				</button>
				{error.error && <p className='text-red-500'>{error.message}</p>}
			</div>
		</>
	);
};

export default StudentRegisterPage;

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
