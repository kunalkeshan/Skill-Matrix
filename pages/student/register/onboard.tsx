import React, { useEffect } from 'react';
import { app, db } from '@/firebase';
import { withSessionSsr } from '@/utils/withSession';
import { doc, getDoc } from 'firebase/firestore';
import Head from 'next/head';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { AppRegEx } from '@/config';
import { useRouter } from 'next/router';
import { useAppDispatch } from '@/hooks/hooks';
import { showLoading } from '@/store/features/app';
import axios, { AxiosError } from 'axios';
import { getAuth, GoogleAuthProvider, signOut } from 'firebase/auth';
import PublicLayout from '@/layouts/PublicLayout';
import { loginStudent } from '@/store/features/student';
import { toast } from 'react-hot-toast';

const auth = getAuth(app);

const studentOnboardSchema = Yup.object().shape({
	name: Yup.string().required(),
	phone: Yup.string().required(),
	regNo: Yup.string()
		.required()
		.matches(AppRegEx.studentRegNo, 'Should match RAXXXXXXXXXXXXX'),
});

type StudentOnboardValues = Yup.InferType<typeof studentOnboardSchema>;

const StudentRegistrationOnboardPage = () => {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const initialValues: StudentOnboardValues = {
		name: (router.query.name as string) ?? '',
		phone: (router.query.phone as string) ?? '',
		regNo: '',
	};

	const handleStudentOnboard = async (values: StudentOnboardValues) => {
		try {
			dispatch(showLoading(true));
			const data = {
				...values,
				email: router.query.email,
				avatar: router.query.avatar,
			};
			await axios.post<AxiosBaseResponse>('/api/student/register', data);
			dispatch(loginStudent(data as Student));
			router.push(`/student/${values.regNo}`);
		} catch (error) {
			if (error instanceof AxiosError) {
				switch (error.response?.data.message) {
					case 'app/internal-server-error': {
						// TODO: Use React Hot Toast here and every else as well, register index and login
						break;
					}
				}
			}
			await signOut(auth);
		} finally {
			dispatch(showLoading(false));
		}
	};

	useEffect(() => {
		if (router.query.progress?.includes('newStudent')) {
			toast('You need to create an account to access Skill Matrix!', {
				position: 'bottom-right',
			});
		}
	}, [router.events]);

	return (
		<>
			<Head>
				<title>Student Onboarding</title>
			</Head>
			<PublicLayout>
				<section className='w-full min-h-screen px-6 flex md:items-center justify-center py-20 md:py-0'>
					<div className='bg-white max-w-lg px-6 py-12 rounded-2xl shadow-lg flex flex-col items-center justify-center gap-8'>
						<Formik
							initialValues={initialValues}
							validationSchema={studentOnboardSchema}
							onSubmit={handleStudentOnboard}
						>
							{({ errors }) => (
								<Form className='flex flex-col w-full min-w-[280px]'>
									<h1 className='w-full text-center text-3xl md:text-5xl font-primary font-semibold text-primary'>
										Student Onboarding
									</h1>
									<p className='max-w-sm w-full text-center font-medium text-neutral mx-auto'>
										Fill in the details below to complete
										your account setup. You can edit them
										later in your profile page.
									</p>
									<Field
										name='name'
										type='text'
										placeholder='Name'
										autocomplete='off'
										className={`input ${
											errors.name
												? '!border-red-500 placeholder:text-red-500'
												: ''
										}`}
									/>
									<ErrorMessage
										component='div'
										name='name'
										className='input-error'
									/>
									<Field
										name='phone'
										type='tel'
										autocomplete='off'
										placeholder='Phone'
										className={`input ${
											errors.phone
												? '!border-red-500 placeholder:text-red-500'
												: ''
										}`}
									/>
									<ErrorMessage
										component='div'
										name='phone'
										className='input-error'
									/>
									<Field
										name='regNo'
										type='text'
										autocomplete='off'
										placeholder='Register number'
										className={`input ${
											errors.regNo
												? '!border-red-500 placeholder:text-red-500'
												: ''
										}`}
									/>
									<ErrorMessage
										component='div'
										name='regNo'
										className='input-error'
									/>
									<button type='submit' className='btn mt-8'>
										Submit
									</button>
								</Form>
							)}
						</Formik>
					</div>
				</section>
			</PublicLayout>
		</>
	);
};

export default StudentRegistrationOnboardPage;

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
		} else if (req.url?.includes('name')) {
			return {
				props: {},
			};
		}
		return {
			redirect: {
				destination: `/student/register`,
				permanent: true,
			},
		};
	}
);
