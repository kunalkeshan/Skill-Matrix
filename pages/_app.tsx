import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import wrapper from '@/store/store';
import Backdrop from '@/components/reusable/Backdrop';
import { Newsreader, Kumbh_Sans } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { getCookie } from 'cookies-next';
import { useLayoutEffect } from 'react';
import {
	collection,
	getDocs,
	query,
	where,
	onSnapshot,
} from 'firebase/firestore';
import { db } from '@/firebase';
import { loginStudent } from '@/store/features/student';

const newsreader = Newsreader({
	style: ['italic', 'normal'],
	subsets: ['latin'],
	weight: ['200', '300', '400', '500', '600', '700', '800'],
	variable: '--font-newsreader',
});

const kumbhSans = Kumbh_Sans({
	style: ['normal'],
	subsets: ['latin'],
	weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
	variable: '--font-kumbh-sans',
});

type CustomAppProps = AppProps;

const App = ({ Component, ...rest }: CustomAppProps) => {
	const { store: appStore, props } = wrapper.useWrappedStore(rest);
	const { pageProps } = props;

	useLayoutEffect(() => {
		const regNoCookie = getCookie(
			'skill-matrix-student-reg-no'
		)?.toString();
		const getStudent = async (regNo: string) => {
			const studentsRef = collection(db, 'students');
			const q = query(studentsRef, where('regNo', '==', regNo));
			onSnapshot(q, (querySnapshot) => {
				querySnapshot.docChanges().forEach((change) => {
					if (change.type === 'modified') {
						appStore.dispatch(
							loginStudent(change.doc.data() as Student)
						);
					}
				});
			});
		};

		if (regNoCookie) getStudent(regNoCookie);
	}, []);

	return (
		<Provider store={appStore}>
			<main className={`${newsreader.variable} ${kumbhSans.variable}`}>
				<Component {...pageProps} />
				<Backdrop />
				<Toaster />
			</main>
		</Provider>
	);
};

export default App;
