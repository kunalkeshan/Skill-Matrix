import * as IronSession from 'iron-session';

declare module 'iron-session' {
	interface IronSessionData {
		user: {
			token?: string;
			email?: string;
		};
	}
}
