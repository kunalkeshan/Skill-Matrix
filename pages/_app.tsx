import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import wrapper from '@/store/store';
import Backdrop from '@/components/reusable/Backdrop';
import { Newsreader, Kumbh_Sans } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

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
