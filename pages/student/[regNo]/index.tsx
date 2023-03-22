import { db } from '@/firebase';
import { withSessionSsr } from '@/utils/withSession';
import {
	collection,
	doc,
	getDocs,
	onSnapshot,
	query,
	updateDoc,
	where,
} from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import {
	InferGetServerSidePropsType,
	NextPage,
	GetServerSidePropsResult,
} from 'next';
import Head from 'next/head';
import PublicLayout from '@/layouts/PublicLayout';
import Image from 'next/image';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import ArticleIcon from '@mui/icons-material/Article';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { loginStudent } from '@/store/features/student';
import { toast } from 'react-hot-toast';

const StudentProfilePage: NextPage<
	InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ student: pageStudent, isCurrentUser }) => {
	const [student, setStudent] = useState(pageStudent);
	const dispatch = useAppDispatch();
	const { student: stateStudent } = useAppSelector((state) => state.student);
	const [input, setInput] = useState({
		about: student.about,
		skills: student?.skills,
	});
	const [edit, setEdit] = useState({
		about: false,
		skills: false,
	});
	const inputRef = {
		about: useRef<HTMLInputElement | null>(null),
		skills: useRef<HTMLTextAreaElement | null>(null),
	};

	type Inputs = 'about' | 'skills';

	const handleInput = (prop: Inputs, value: string | string[]) => {
		setInput((prev) => {
			return { ...prev, [prop]: value };
		});
	};

	const handleDisabled =
		(prop: Inputs) => (e: React.MouseEvent<HTMLButtonElement>) => {
			setEdit((prev) => {
				const nextState = !edit[prop];
				if (nextState) {
					console.log(inputRef[prop].current);
					inputRef[prop].current?.focus();
				} else if (!nextState && input[prop]?.length === 0) {
					setInput({ ...input, [prop]: student[prop] });
				} else if (!nextState && stateStudent![prop] !== input[prop]) {
					setInput({ ...input, [prop]: stateStudent![prop] });
				}
				return {
					...prev,
					[prop]: nextState,
				};
			});
		};

	const handleInputSave = (prop: Inputs) => async () => {
		try {
			if (input[prop]?.length !== 0) {
				const studentRef = doc(db, 'students', student.email);
				await updateDoc(studentRef, {
					[prop]: input[prop],
				});
				setEdit({ ...edit, [prop]: false });
				setInput({ ...input, [prop]: input[prop] });
				dispatch(loginStudent({ ...student, [prop]: input[prop] }));
				return;
			}
			toast.error(`${prop} cannot be empty!`, {
				position: 'bottom-right',
			});
		} catch (error) {
			toast.error(
				`Unable to update ${prop} at the moment. Try again later.`
			);
		}
	};

	useEffect(() => {
		const studentsRef = collection(db, 'students');
		const q = query(studentsRef, where('regNo', '==', student.regNo));
		onSnapshot(q, (querySnapshot) => {
			querySnapshot.docChanges().forEach((change) => {
				if (change.type === 'modified') {
					const data = change.doc.data() as Student;
					setStudent(data);
				}
			});
		});
	}, []);

	return (
		<>
			<Head>
				<title>{student.name}</title>
			</Head>
			<PublicLayout>
				<section className='w-full min-h-screen flex flex-col'>
					<header className='w-full min-h-[320px] bg-secondary1 relative px-10'>
						<div className='max-w-5xl bg-white rounded-3xl px-10 py-8 grid grid-cols-1 sm:grid-cols-2 gap-8 absolute -translate-x-1/2 -translate-y-1/2 top-full left-1/2 w-[80%]'>
							<div className='max-w-[8rem] md:max-w-[12rem] rounded-full overflow-hidden mx-auto w-full'>
								<Image
									src={student.avatar}
									width={100}
									height={100}
									alt='Skill-Matrix'
									className='w-full h-auto object-contain'
								/>
							</div>
							<div>
								<h1 className='font-primary text-primary text-xl md:text-3xl font-semibold'>
									{student.name}
								</h1>
								<ul></ul>
							</div>
						</div>
					</header>
					<main className='max-w-2xl lg:max-w-4xl w-full mx-auto mt-52 px-10'>
						<h2 className='font-primary text-primary text-xl font-semibold md:text-3xl'>
							About
						</h2>
						<input
							value={input.about}
							onChange={(e) =>
								handleInput('about', e.target.value)
							}
							disabled={!edit.about}
							ref={inputRef.about}
							className={`${
								edit.about
									? 'bg-white border border-primary shadow-sm'
									: 'border-transparent'
							} w-full text-neutral outline-none rounded-md text-lg mt-4 bg-inherit px-4 py-2 transition-all duration-300`}
						/>
						{student?.about?.length === 0 && (
							<p className='w-full text-neutral text-lg mt-4 bg-inherit px-4 py-2'>
								Uh oh! ☕ There's nothing to see here.
								{isCurrentUser &&
									' Click on edit to get started!'}
							</p>
						)}
						{isCurrentUser && (
							<div className='flex gap-8 w-fit mt-8 px-4'>
								<button
									onClick={handleDisabled('about')}
									className={`rounded-5xl px-4 py-2 uppercase font-semibold bg-primary text-white`}
								>
									{!edit.about ? 'Edit' : 'Cancel'}
								</button>
								<button
									onClick={handleInputSave('about')}
									className={`${
										student?.about !== input.about
											? 'text-primary text-opacity-100 cursor-pointer'
											: 'text-opacity-50 cursor-default'
									} font-semibold uppercase transition-all duration-300`}
									disabled={student?.about === input.about}
								>
									Save
								</button>
							</div>
						)}
						<h2 className='font-primary text-primary text-xl font-semibold md:text-3xl mt-12'>
							Skills
						</h2>
						<ul className='w-full flex gap-4 mt-4'>
							{student?.skills?.length! > 0 &&
							student?.skills![0].length !== 0 ? (
								student.skills?.map((skill, index) => (
									<li
										key={index}
										className='px-4 py-2 text-sm bg-secondary1 bg-opacity-80 transition-all duration-300 hover:bg-opacity-100 font-semibold cursor-default hover:shadow-sm hover:-translate-y-1 lowercase rounded-3xl'
									>
										{skill}
									</li>
								))
							) : (
								<li className='w-full text-neutral text-lg mt-4 bg-inherit px-4 py-2'>
									Uh oh! ☕ There's nothing to see here.
									{isCurrentUser &&
										' Click on edit to get started!'}
								</li>
							)}
						</ul>
						{isCurrentUser && edit.skills && (
							<>
								<p className='mt-4 text-xs md:text-sm'>
									Enter each skill with ",", eg: typescript,
									python, tensorflow, ....
								</p>
								<textarea
									value={input.skills?.join(',')}
									onChange={(e) => {
										handleInput(
											'skills',
											e.target.value.split(',')
										);
									}}
									disabled={!edit.skills}
									ref={inputRef.skills}
									className={`${
										edit.skills
											? 'bg-white border border-primary shadow-sm'
											: 'border-transparent'
									} w-full resize-y min-h-fit text-neutral outline-none rounded-md mt-1 text-lg bg-inherit px-4 py-2 transition-all duration-300`}
								/>
							</>
						)}
						{isCurrentUser && (
							<div className='flex gap-8 w-fit mt-8 px-4'>
								<button
									onClick={handleDisabled('skills')}
									className={`rounded-5xl px-4 py-2 uppercase font-semibold bg-primary text-white`}
								>
									{!edit.skills ? 'Edit' : 'Cancel'}
								</button>
								<button
									onClick={handleInputSave('skills')}
									className={`${
										student?.skills !== input.skills
											? 'text-primary text-opacity-100 cursor-pointer'
											: 'text-opacity-50 cursor-default'
									} font-semibold uppercase transition-all duration-300`}
									disabled={student?.skills === input.skills}
								>
									Save
								</button>
							</div>
						)}
					</main>
				</section>
			</PublicLayout>
		</>
	);
};

export default StudentProfilePage;

export const getServerSideProps = withSessionSsr(
	async function getServerSideProps({ req, params }): Promise<
		GetServerSidePropsResult<{
			student: Student;
			isCurrentUser: boolean;
		}>
	> {
		const user = req.session.user;
		const { regNo } = params!;
		if (!regNo) {
			return {
				notFound: true,
			};
		}

		const studentsRef = collection(db, 'students');
		const q = query(studentsRef, where('regNo', '==', regNo));

		const querySnapshot = await getDocs(q);
		if (querySnapshot.empty) {
			return {
				notFound: true,
			};
		}

		const student = querySnapshot.docs
			.find((doc) => doc.data().regNo === regNo)
			?.data() as Student;

		return {
			props: {
				student,
				isCurrentUser: student.email === user?.email,
			},
		};
	}
);
