import { db } from '@/firebase';
import { withSessionSsr } from '@/utils/withSession';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React from 'react';
import {
	InferGetServerSidePropsType,
	NextPage,
	GetServerSidePropsResult,
} from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import PublicLayout from '@/layouts/PublicLayout';
import Image from 'next/image';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import ArticleIcon from '@mui/icons-material/Article';

const StudentProfilePage: NextPage<
	InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ student }) => {
	const router = useRouter();

	return (
		<>
			<Head>
				<title>{student.name}</title>
			</Head>
			<PublicLayout>
				<section className='w-full min-h-screen'>
					<header className='w-full min-h-[320px] bg-secondary1 relative'>
						<div className='max-w-5xl bg-white rounded-3xl px-10 py-8 grid grid-cols-1 md:grid-cols-2 gap-8 absolute -translate-x-1/2 -translate-y-1/2 top-full left-1/2'>
							<div className='max-w-[12rem] rounded-full overflow-hidden mx-auto w-full'>
								<Image
									src={student.avatar}
									width={100}
									height={100}
									alt='Skill-Matrix'
									className='w-full h-auto object-contain'
								/>
							</div>
							<div>
								<h1 className='font-primary text-primary text-xl md:text-3xl font-semibold'>
									{student.name}
								</h1>
								<ul></ul>
							</div>
						</div>
					</header>
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
