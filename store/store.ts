import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import { appSlice } from './features/app';

const makeStore = () =>
	configureStore({
		reducer: {
			[appSlice.name]: appSlice.reducer,
		},
	});

export const store = makeStore();

export type RootState = ReturnType<typeof store.getState>;

const wrapper = createWrapper(makeStore);

export default wrapper;
