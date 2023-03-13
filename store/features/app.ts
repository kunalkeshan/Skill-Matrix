import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

interface AppState {
	loading: boolean;
}

const initialState: AppState = {
	loading: false,
};

export const appSlice = createSlice({
	name: 'app',
	initialState,
	reducers: {
		showLoading: (state, action: PayloadAction<boolean>) => {
			state.loading = action.payload;
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

export const { showLoading } = appSlice.actions;

export default appSlice.reducer;
