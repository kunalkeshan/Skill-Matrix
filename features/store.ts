import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';

const makeStore = () =>
	configureStore({
		reducer: {},
	});

export const store = makeStore();

export type RootState = ReturnType<typeof store.getState>;

const wrapper = createWrapper(makeStore);

export default wrapper;
