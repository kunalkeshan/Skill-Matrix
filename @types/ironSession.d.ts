import * as IronSession from 'iron-session';

declare module 'iron-session' {
	interface IronSessionData {
		user: {
			email?: string;
		};
	}
}
