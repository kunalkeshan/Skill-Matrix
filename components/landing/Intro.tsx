import Link from 'next/link';
import Image from 'next/image';

const Intro = () => {
	return (
		<div className='z-10 relative w-full overflow-hidden min-h-screen flex items-center justify-center px-6 py-20 md:py-0'>
			<div className='z-[5] w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-4'>
				<div className='text-center md:text-left'>
					<h1 className='font-primary md:max-w-none max-w-lg mx-auto text-primary text-4xl md:text-5xl font-semibold'>
						Streamline the student-project matching process with
						Skill Matrix
					</h1>
					<p className='mt-8 max-w-lg md:max-w-none mx-auto text-neutral text-xl md:text-2xl'>
						Revolutionize your project team selection with our
						innovative tool that calculates CCC matrix marks and
						recommends the best-fit projects. Try it now!
					</p>
					<div className='flex gap-4 mt-12 items-center md:w-fit justify-center'>
						<Link href={'/student/login'} className='btn'>
							Calculate Now
						</Link>
						<Link
							href={'/#features'}
							className='btn !bg-gray-300 hover:!bg-gray-400 !text-neutral'
						>
							Explore
						</Link>
					</div>
				</div>
				<div className='w-full flex items-center justify-center'>
					<div className='max-w-md animate-float'>
						<Image
							src='/assets/svgs/landing.svg'
							width={100}
							height={100}
							alt='Skill-Matrix'
							className='w-full h-auto object-contain'
						/>
					</div>
				</div>
			</div>
			<div className='z-0 w-full md:w-1/2 bg-primary h-full md:top-0 right-0 absolute -bottom-[55%]' />
			<div className='w-80 h-80 rounded-full bg-secondary2 absolute z-0 -left-10 -top-16 animate-float' />
			<div className='w-80 h-80 hidden md:block bg-secondary3 rotate-45 absolute z-0 -left-10 bottom-20 animate-float' />
		</div>
	);
};

export default Intro;
