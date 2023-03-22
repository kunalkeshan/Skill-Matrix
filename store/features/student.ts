import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { deleteCookie } from 'cookies-next';
import { HYDRATE } from 'next-redux-wrapper';

interface StudentState {
	student: Student | null;
}

const initialState: StudentState = {
	student:
		typeof window !== 'undefined'
			? JSON.parse(localStorage.getItem('skill-matrix-student')!)
			: null,
};

export const studentSlice = createSlice({
	name: 'student',
	initialState,
	reducers: {
		loginStudent: (state, action: PayloadAction<Student>) => {
			const student = action.payload;
			state.student = student;
			localStorage.setItem(
				'skill-matrix-student',
				JSON.stringify(student)
			);
		},
		logoutStudent: (state) => {
			state.student = null;
			deleteCookie('skill-matrix-student-reg-no');
			localStorage.removeItem('skill-matrix-student');
		},
	},
	extraReducers: {
		[HYDRATE]: (state, action) => {
			return {
				...state,
				...action.payload,
			};
		},
	},
});

export const { loginStudent, logoutStudent } = studentSlice.actions;

export default studentSlice.reducer;
