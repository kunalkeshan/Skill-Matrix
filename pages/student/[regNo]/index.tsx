import { app, db } from '@/firebase';
import { withSessionSsr } from '@/utils/withSession';
import {
	collection,
	doc,
	getDoc,
	getDocs,
	query,
	where,
} from 'firebase/firestore';
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
