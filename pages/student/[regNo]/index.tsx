import { app, db } from '@/firebase';
import { withSessionSsr } from '@/utils/withSession';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React from 'react';
import {
	InferGetServerSidePropsType,
	NextPage,
	GetServerSidePropsResult,
} from 'next';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'next/router';
import axios from 'axios';
import Head from 'next/head';
import PublicLayout from '@/layouts/PublicLayout';
import Image from 'next/image';

const auth = getAuth(app);

const StudentProfilePage: NextPage<
	InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ student }) => {
	const router = useRouter();

	const handleLogout = async () => {
		signOut(auth);
		await axios.post('/api/student/logout');
		router.push('/student/login');
	};

	return (
		<>
			<Head>
				<title>{student.name}</title>
			</Head>
			<PublicLayout>
				<section className='w-full min-h-screen'>
					<header className='w-full min-h-[320px] bg-secondary1'>
						<div>
							<div className='max-w-md animate-float'>
								<Image
									src={student.avatar}
									width={100}
									height={100}
									alt='Skill-Matrix'
									className='w-full h-auto object-contain'
								/>
							</div>
							<div>
								<h1>{student.name}</h1>
							</div>
						</div>
					</header>
					<button onClick={handleLogout}>Sign Out</button>
				</section>
			</PublicLayout>
		</>
	);
};

export default StudentProfilePage;

export const getServerSideProps = withSessionSsr(
	async function getServerSideProps({
		req,
		params,
	}): Promise<
		GetServerSidePropsResult<{ student: Student; isCurrentUser: boolean }>
	> {
		const user = req.session.user;
		const { regNo } = params!;
		if (!regNo) {
			return {
				notFound: true,
			};
		}

		const studentsRef = collection(db, 'students');
		const q = query(studentsRef, where('regNo', '==', regNo));

		const querySnapshot = await getDocs(q);
		if (querySnapshot.empty) {
			return {
				notFound: true,
			};
		}

		const student = querySnapshot.docs
			.find((doc) => doc.data().regNo === regNo)
			?.data() as Student;
		if (!student) {
			return {
				notFound: true,
			};
		}

		return {
			props: {
				student,
				isCurrentUser: student.email === user?.email,
			},
		};
	}
);
