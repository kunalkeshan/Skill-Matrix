import React from 'react';
import {
	getAuth,
	signInWithRedirect,
	GoogleAuthProvider,
	getRedirectResult,
	signInWithPopup,
} from 'firebase/auth';
import { app } from '@/firebase';
import { withSessionSsr } from '@/utils/withSession';

const StudentLoginPage = () => {
	const handleAuth = () => {
		const provider = new GoogleAuthProvider();
		const auth = getAuth(app);
		signInWithPopup(auth, provider)
			.then((result) => {
				const credential = GoogleAuthProvider.credentialFromResult(
					result!
				);
				const token = credential!.accessToken;

				const user = result!.user;
				console.log(user);
			})
			.catch((e) => console.log(e));
	};

	return (
		<div>
			<button onClick={handleAuth}>
				Login with Google (use srm email)
			</button>
		</div>
	);
};

export default StudentLoginPage;

export const getServerSideProps = withSessionSsr(
	async function getServerSideProps({ req }) {
		const user = req.session.user;
		if (user?.token) {
			return {
				redirect: {
					destination: `/student/${user?.regNo}`,
					permanent: true,
				},
			};
		}
		return {
			props: {},
		};
	}
);
