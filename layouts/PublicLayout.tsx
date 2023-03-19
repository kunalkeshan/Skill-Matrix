import Footer from '@/components/layouts/Footer';
import Navbar from '@/components/layouts/Navbar';
import React, { PropsWithChildren } from 'react';
import Headroom from 'react-headroom';

const PublicLayout: React.FC<PropsWithChildren> = ({ children }) => {
	return (
		<>
			<Headroom>
				<Navbar />
			</Headroom>
			{children}
			<Footer />
		</>
	);
};

export default PublicLayout;
