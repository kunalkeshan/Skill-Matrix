import About from '@/components/landing/About';
import Contact from '@/components/landing/Contact';
import FAQ from '@/components/landing/FAQ';
import Features from '@/components/landing/Features';
import Intro from '@/components/landing/Intro';
import { useAppSelector } from '@/hooks/hooks';
import useFirebaseAuth from '@/hooks/useFirebaseAuth';
import PublicLayout from '@/layouts/PublicLayout';
import Head from 'next/head';

export default function Home() {
	const { student } = useFirebaseAuth({});

	console.log(student);

	return (
		<>
			<Head>
				<title>Skill Matrix</title>
				<meta
					name='description'
					content='Generated by create next app'
				/>
				<meta
					name='viewport'
					content='width=device-width, initial-scale=1'
				/>
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<PublicLayout>
				<Intro />
				<About />
				<Features />
				<Contact />
				<FAQ />
			</PublicLayout>
		</>
	);
}
