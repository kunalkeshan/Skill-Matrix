import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

interface StudentState {
	student: Student | null;
}

const initialState: StudentState = {
	student: null,
};

export const studentSlice = createSlice({
	name: 'student',
	initialState,
	reducers: {
		loginStudent: (state, action: PayloadAction<Student>) => {
			state.student = action.payload;
		},
		logoutStudent: (state) => {
			state.student = null;
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
