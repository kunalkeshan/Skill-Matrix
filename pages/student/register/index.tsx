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
import PublicLayout from '@/layouts/PublicLayout';
import Image from 'next/image';
import Link from 'next/link';

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
			<PublicLayout>
				<section className='w-full min-h-screen px-6 flex md:items-center justify-center py-20 md:py-0'>
					<div className='bg-white max-w-lg px-6 py-12 rounded-2xl shadow-lg flex flex-col items-center justify-center gap-8'>
						<div className='rounded-full overflow-hidden w-[10rem] h-[10rem] bg-secondary1 p-5 flex items-center justify-center'>
							<Image
								src='/assets/svgs/register.svg'
								width={100}
								height={100}
								alt='Skill-Matrix'
								className='w-full h-auto object-contain'
							/>
						</div>
						<h1 className='font-primary text-primary text-5xl md:text-7xl font-semibold'>
							Register
						</h1>
						<p className='text-neutral text-xl text-center'>
							Create a account using your SRM mail id to and get
							started with the marks calculation.
						</p>
						<button
							onClick={handleAuth}
							className='flex w-full items-center gap-8 justify-center px-7 py-3 bg-secondary1 rounded-5xl transition-all duration-300 hover:scale-95 active:scale-105'
						>
							<div className='w-16 h-16'>
								<Image
									src='/assets/svgs/google-icon.svg'
									width={100}
									height={100}
									alt='Skill-Matrix'
									className='w-full h-auto object-contain'
								/>
							</div>
							<p className='flex flex-col text-left font-semibold'>
								<span className='text-lg md:text-xl'>
									Register with Google
								</span>
								<span className='text-xs md:text-sm'>
									(use srm email)
								</span>
							</p>
						</button>
						{error.error && (
							<p className='text-red-500 w-full text-center px-4 py-2 border border-red-500 bg-red-200 rounded-xl'>
								{error.message}
							</p>
						)}
						<Link
							href={'/student/login'}
							className='w-full text-center text-primary transition-all duration-300 hover:underline'
						>
							Already have an account? Login here.
						</Link>
					</div>
				</section>
			</PublicLayout>
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
