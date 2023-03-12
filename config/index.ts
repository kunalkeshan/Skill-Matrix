/**
 * Application Configuration
 */

// Dependencies
import { IronSessionOptions } from 'iron-session';

export const isProduction = process.env.NODE_ENV === 'production';

export const ironOptions: IronSessionOptions = {
	cookieName: 'skill-matrix-user-auth-cookie',
	password: process.env.IRON_SESSION_COOKIE_PASSWORD!,
	...(isProduction && { secure: true }),
	cookieOptions: {
		secure: isProduction,
	},
};
