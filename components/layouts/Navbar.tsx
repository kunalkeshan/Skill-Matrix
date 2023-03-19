import Link from 'next/link';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { TransitionProps } from '@mui/material/transitions';
import { NAV_LINKS } from '@/data/navigation';
import React, { useState } from 'react';
import { Dialog, Slide } from '@mui/material';

const Transition = React.forwardRef(function Transition(
	props: TransitionProps & {
		children: React.ReactElement;
	},
	ref: React.Ref<unknown>
) {
	return <Slide direction='up' ref={ref} {...props} />;
});

const Navbar = () => {
	const [open, setOpen] = useState(false);
	const handleOpen = () => {
		setOpen(true);
	};
	const handleClose = () => {
		setOpen(false);
	};
	return (
		<nav className='w-full bg-white text-primary px-6 md:py-7 py-3 z-50'>
			<div className='mx-auto max-w-7xl flex items-center justify-between'>
				<Link
					href='/'
					className='font-semibold flex gap-2 items-center text-2xl transition-all duration-300 hover:scale-95 active:scale-105'
				>
					<CloudQueueIcon /> <p>Skill-Matrix</p>
				</Link>
				<ul className='md:flex gap-8 hidden'>
					{NAV_LINKS.map((link) => (
						<li className='text-lg transition-all duration-300 hover:text-secondary3 font-bold'>
							<Link href={link.url}>{link.name}</Link>
						</li>
					))}
				</ul>
				<button
					onClick={handleOpen}
					className='p-3 md:hidden bg-primary text-white rounded-full transition-all duration-300 active:bg-secondary3 focus:bg-secondary3'
				>
					<MenuIcon className='scale-110' />
				</button>
			</div>
			<Dialog
				fullScreen
				open={open}
				onClose={handleClose}
				TransitionComponent={Transition}
				className='md:hidden'
			>
				<div className='w-full px-6 py-7 text-primary'>
					<div className='w-full mx-auto max-w-5xl flex items-center justify-between'>
						<Link
							href='/'
							className='font-semibold flex gap-2 items-center text-4xl transition-all duration-300 hover:scale-95 active:scale-105'
							onClick={handleClose}
						>
							<CloudQueueIcon /> <p>Skill-Matrix</p>
						</Link>
						<button
							onClick={handleClose}
							className='p-3 bg-primary text-white rounded-full transition-all duration-300 active:bg-secondary3 focus:bg-secondary3'
						>
							<CloseIcon className='scale-110' />
						</button>
					</div>
					<ul className='flex flex-col gap-4 max-w-5xl mt-8'>
						{NAV_LINKS.map((link) => (
							<li className='text-3xl transition-all duration-300 hover:text-secondary3 font-bold'>
								<Link href={link.url} onClick={handleClose}>
									{link.name}
								</Link>
							</li>
						))}
					</ul>
				</div>
			</Dialog>
		</nav>
	);
};

export default Navbar;
