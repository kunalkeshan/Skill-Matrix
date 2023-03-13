import React from 'react';
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

const provider = new GoogleAuthProvider();
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
			await axios.post<AxiosBaseResponse>('/api/student/register', {
				...values,
				email: router.query.email,
			});
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

	return (
		<>
			<Head>
				<title>Student Onboarding</title>
			</Head>
			<div>
				<Formik
					initialValues={initialValues}
					validationSchema={studentOnboardSchema}
					onSubmit={handleStudentOnboard}
				>
					<Form>
						<Field name='name' type='text' placeholder='Name' />
						<ErrorMessage component='div' name='name' />
						<Field name='phone' type='tel' placeholder='Phone' />
						<ErrorMessage component='div' name='phone' />
						<Field
							name='regNo'
							type='text'
							placeholder='Register number'
						/>
						<ErrorMessage component='div' name='regNo' />
						<button type='submit'>Submit</button>
					</Form>
				</Formik>
			</div>
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