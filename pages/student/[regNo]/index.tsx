import { app, db } from '@/firebase';
import { withSessionSsr } from '@/utils/withSession';
import { doc, getDoc } from 'firebase/firestore';
import React from 'react';
import {
	InferGetServerSidePropsType,
	NextPage,
	GetServerSidePropsResult,
} from 'next';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'next/router';
import {} from 'iron-session';
import axios from 'axios';

const auth = getAuth(app);

const StudentProfilePage: NextPage<
	InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ student }) => {
	const router = useRouter();
	return (
		<div>
			{student.name}
			<button
				onClick={async () => {
					signOut(auth);
					await axios.post('/api/student/logout');
					router.push('/student/login');
				}}
			>
				Sign Out
			</button>
		</div>
	);
};

export default StudentProfilePage;

export const getServerSideProps = withSessionSsr(
	async function getServerSideProps({
		req,
	}): Promise<GetServerSidePropsResult<{ student: Student }>> {
		const user = req.session.user;
		if (user?.email) {
			const docRef = doc(db, 'students', user.email!);
			const docSnap = await getDoc(docRef);
			const data = docSnap.data() as Student;
			return {
				props: {
					student: data,
				},
			};
		}
		return {
			redirect: {
				destination: '/student/login',
				permanent: true,
			},
		};
	}
);
