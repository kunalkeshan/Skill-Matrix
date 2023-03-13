import React from 'react';
import { useAppSelector } from '@/hooks/hooks';

const Backdrop = () => {
	const { loading } = useAppSelector((state) => state.app);
	return (
		<div
			className={`${
				loading ? 'flex' : 'hidden'
			} items-center justify-center w-full h-screen fixed top-0 left-0 bg-black bg-opacity-40 z-50`}
		>
			<div className='w-16 h-16 border-b-2 border-white rounded-full animate-spin'></div>
		</div>
	);
};

export default Backdrop;
