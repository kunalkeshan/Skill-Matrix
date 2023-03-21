import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import { appSlice } from './features/app';
import { studentSlice } from './features/student';

const makeStore = () =>
	configureStore({
		reducer: {
			[appSlice.name]: appSlice.reducer,
			[studentSlice.name]: studentSlice.reducer,
		},
	});

export const store = makeStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const wrapper = createWrapper(makeStore);

export default wrapper;
