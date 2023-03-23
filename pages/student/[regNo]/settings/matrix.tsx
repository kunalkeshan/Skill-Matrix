import React from 'react';
import { Formik } from 'formik';

const StudentMatrixSettingsPage = () => {
	return (
		<section className='container mx-auto py-20 px-36'>
			<div className='border-b border-black/10 pb-5 mb-10'>
				<h1 className='text-primary text-5xl font-semibold'>
					Ranking Matrix
				</h1>
				<p className='text-xl'>
					Fill the form to calculate your matrix rank
				</p>
			</div>
			<div>
				<form>
					<div className='flex w-full border-b border-black/10 pb-5 mb-5'>
						<div className='w-[50%]'>
							<h1 className='text-xl font-semibold '>
								Academic Grades
							</h1>
							<p>Total Alloted Marks: 10</p>
						</div>
						<div className='w-[50%]'>
							<div className='flex flex-col mb-2'>
								<label
									className='font-semibold text-neutral'
									htmlFor='10th-Percentage'
								>
									10th Percentage
								</label>
								<input
									className='input'
									id='10thPercentage'
									type='text'
									placeholder='Enter your percentage'
								/>
							</div>
							<div className='flex flex-col mb-2'>
								<label
									className='font-semibold text-neutral'
									htmlFor='12th-Percentage'
								>
									12th Percentage
								</label>
								<input
									className='input'
									id='12thPercentage'
									type='text'
									placeholder='Enter your percentage'
								/>
							</div>
							<div className='flex flex-col mb-2'>
								<label
									className='font-semibold text-neutral'
									htmlFor='Current-CGPA'
								>
									Current CGPA
								</label>
								<input
									className='input'
									id='Current-CGPA'
									type='text'
									placeholder='Enter your CGPA'
								/>
							</div>
						</div>
					</div>
					<div className='flex w-full border-b border-black/10 pb-5 mb-5'>
						<div className='w-[50%]'>
							<h1 className='text-xl font-semibold '>
								Coding Platform Practice
							</h1>
							<p>Total Alloted Marks: 10</p>
						</div>
						<div className='w-[50%]'>
							<div className='flex flex-col mb-2'>
								<label
									className='font-semibold text-neutral'
									htmlFor='badges-recognitions'
								>
									No. of Badges / Recognitions earned
								</label>
								<input
									className='input'
									id='badges-recognitions'
									type='text'
									placeholder='Enter the number of badges and recognitions'
								/>
							</div>
							<div className='flex flex-col mb-2'>
								<label
									className='font-semibold text-neutral'
									htmlFor='questions-solved'
								>
									No. of Medium and Difficult questions solved
								</label>
								<input
									className='input'
									id='questions-solved'
									type='text'
									placeholder='Enter the numbers of questions solved'
								/>
							</div>
						</div>
					</div>
					<div className='flex w-full border-b border-black/10 pb-5 mb-5'>
						<div className='w-[50%]'>
							<h1 className='text-xl font-semibold '>
								Internship Experience
							</h1>
							<p>Total Alloted Marks: 10</p>
						</div>
						<div className='w-[50%]'>
							<div className='flex flex-col mb-2'>
								<label
									className='font-semibold text-neutral'
									htmlFor='internship'
								>
									No. of Internships
								</label>
								<input
									className='input'
									id='internship'
									type='text'
									placeholder='Enter the number of internships'
								/>
							</div>
						</div>
					</div>
					<div className='flex w-full border-b border-black/10 pb-5 mb-5'>
						<div className='w-[50%]'>
							<h1 className='text-xl font-semibold '>
								Courses and Certifications
							</h1>
							<p>Total Alloted Marks: 10</p>
						</div>
						<div className='w-[50%]'>
							<div className='flex flex-col mb-2'>
								<label
									className='font-semibold text-neutral'
									htmlFor='courses-certifications'
								>
									No. of courses and certifications
								</label>
								<input
									className='input'
									id='courses-certifications'
									type='text'
									placeholder='Enter the number of courses and certifications'
								/>
							</div>
						</div>
					</div>
					<div className='flex w-full border-b border-black/10 pb-5 mb-5'>
						<div className='w-[50%]'>
							<h1 className='text-xl font-semibold '>Projects</h1>
							<p>Total Alloted Marks: 18</p>
						</div>
						<div className='w-[50%]'>
							<div className='flex flex-col mb-2'>
								<label
									className='font-semibold text-neutral'
									htmlFor='projects'
								>
									Projects Done
								</label>
								<input
									className='input'
									id='projects'
									type='text'
									placeholder='Enter the number of projects you have done'
								/>
							</div>
							<div className='flex flex-col mb-2'>
								<label
									className='font-semibold text-neutral'
									htmlFor='full-stack-experience'
								>
									Full Stack Developer Experience
								</label>
								<input
									className='input'
									id='full-stack-experience'
									type='text'
									placeholder='Enter the number of full stack project experience you have'
								/>
							</div>
							<div className='flex flex-col mb-2'>
								<label
									className='font-semibold text-neutral'
									htmlFor='inhouse-projects'
								>
									In-House Projects
								</label>
								<input
									className='input'
									id='inhouse-pojects'
									type='text'
									placeholder='Enter the number of in-house projects you have'
								/>
							</div>
						</div>
					</div>
					<div className='flex w-full border-b border-black/10 pb-5 mb-5'>
						<div className='w-[50%]'>
							<h1 className='text-xl font-semibold '>
								Coding Competitions and Hackathons Won
							</h1>
							<p>Total Alloted Marks: 10</p>
						</div>
						<div className='w-[50%]'>
							<div className='flex flex-col mb-2'>
								<label
									className='font-semibold text-neutral'
									htmlFor='competitions-hackathons'
								>
									No. of Competitions / Hackathons won
								</label>
								<input
									className='input'
									id='competitions-hackathons'
									type='text'
									placeholder='Enter the number of Competitions / Hackathons won'
								/>
							</div>
						</div>
					</div>
					<div className='flex w-full border-b border-black/10 pb-5 mb-5'>
						<div className='w-[50%]'>
							<h1 className='text-xl font-semibold '>
								Membership of Professional Bodies
							</h1>
							<p>Total Alloted Marks: 2</p>
						</div>
						<div className='w-[50%]'>
							<div className='flex flex-col mb-2'>
								<label
									className='font-semibold text-neutral'
									htmlFor='memberships'
								>
									Membership in Professional Bodies
								</label>
								<input
									className='input'
									id='memberships'
									type='text'
									placeholder='Enter your memberships'
								/>
							</div>
						</div>
					</div>
					<div className='flex w-full border-b border-black/10 pb-5 mb-5'>
						<div className='w-[50%]'>
							<h1 className='text-xl font-semibold '>
								Placement Rank
							</h1>
							<p>Total Alloted Marks: 15</p>
						</div>
						<div className='w-[50%]'>
							<div className='flex flex-col mb-2'>
								<label
									className='font-semibold text-neutral'
									htmlFor='Placement-rank'
								>
									Placement Rank
								</label>
								<input
									className='input'
									id='Placement-rank'
									type='text'
									placeholder='Enter your Placement Rank'
								/>
							</div>
						</div>
					</div>
				</form>
			</div>
		</section>
	);
};

export default StudentMatrixSettingsPage;
