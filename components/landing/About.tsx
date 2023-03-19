import Image from 'next/image';

const About = () => {
	const ABOUT_INFO = [];

	return (
		<section>
			<div>
				<div>
					<h2></h2>
					<p></p>
				</div>
				<div>
					<div>
						<div>
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
						<ul></ul>
					</div>
				</div>
			</div>
		</section>
	);
};

export default About;
