import Image from 'next/image';
import FunctionsIcon from '@mui/icons-material/Functions';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import ModeStandbyIcon from '@mui/icons-material/ModeStandby';

const About = () => {
	const ABOUT_INFO = [
		{
			title: 'Matrix marks calculator - Empower students to stand out',
			description:
				'Our cutting-edge algorithm calculates your CCC matrix marks, helping you stand out from the crowd and achieve your dream project.',
			Icon: FunctionsIcon,
		},
		{
			title: 'Track leaderboard status - Know where you stand',
			description:
				'Keep track of your progress and see where you stand among your peers with our real-time leaderboard status feature.',
			Icon: LeaderboardIcon,
		},
		{
			title: 'Personalized project recommendations - Achieve your potential',
			description:
				'Our advanced machine learning technology provides personalized project recommendations based on your skills and experience, helping you reach your full potential.',
			Icon: ModeStandbyIcon,
		},
	];

	return (
		<section
			id='about'
			className='px-6 py-20 md:py-0 w-full min-h-screen flex items-center justify-center'
		>
			<div className='w-full max-w-7xl'>
				<div className='text-center'>
					<h2 className='font-primary text-4xl md:text-5xl text-primary'>
						About Skill Matrix
					</h2>
					<p className='text-xl mt-4 max-w-xl mx-auto text-neutral'>
						Skill Matrix offers personalized project recommendations
						for students and accurate CCC mark calculation for
						efficient project selection.
					</p>
				</div>
				<div className='w-full grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-8 mt-12 md:place-items-center'>
					<div className='w-full h-full flex items-center justify-center'>
						<div className='max-w-md animate-float'>
							<Image
								src='/assets/svgs/about.svg'
								width={100}
								height={100}
								alt='Skill-Matrix'
								className='w-full h-auto object-contain'
							/>
						</div>
					</div>
					<div>
						<ul className='flex flex-col gap-8 text-center md:text-left'>
							{ABOUT_INFO.map((info, index) => (
								<li
									key={index}
									className='flex gap-4 flex-col md:flex-row justify-center items-center md:items-start'
								>
									<div className='p-2 bg-secondary1 rounded-full'>
										<info.Icon />
									</div>
									<div>
										<h3 className='font-primary text-2xl font-semibold text-primary'>
											{info.title}
										</h3>
										<p className='text-lg text-neutral'>
											{info.description}
										</p>
									</div>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</section>
	);
};

export default About;
