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
import Image from 'next/image';
import Link from 'next/link';

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
				<section className='w-full min-h-screen px-6 flex md:items-center justify-center py-20 md:py-0'>
					<div className='bg-white max-w-lg px-6 py-12 rounded-2xl shadow-lg flex flex-col items-center justify-center gap-8'>
						<div className='rounded-full overflow-hidden w-[10rem] h-[10rem] bg-secondary1 p-5 flex items-center justify-center'>
							<Image
								src='/assets/svgs/login.svg'
								width={100}
								height={100}
								alt='Skill-Matrix'
								className='w-full h-auto object-contain'
							/>
						</div>
						<h1 className='font-primary text-primary text-5xl md:text-7xl font-semibold'>
							Login
						</h1>
						<p className='text-neutral text-xl text-center'>
							Access your account to update your matrix details
							and see your latest scores.
						</p>
						<button
							onClick={handleAuth}
							className='flex w-full items-center gap-8 justify-center px-7 py-3 bg-secondary1 rounded-5xl transition-all duration-300 hover:scale-95 active:scale-105'
						>
							<div className='w-12 h-12'>
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
									Login with Google
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
							href={'/student/register'}
							className='w-full text-center text-primary transition-all duration-300 hover:underline'
						>
							Don't have an account? Register here.
						</Link>
					</div>
				</section>
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
