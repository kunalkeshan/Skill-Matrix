import { withSessionRoute } from '@/utils/withSession';
import { NextApiRequest, NextApiResponse } from 'next';
import ApiError from '@/utils/apiError';
import { deleteCookie } from 'cookies-next';

export default withSessionRoute(
	async (req: NextApiRequest, res: NextApiResponse) => {
		switch (req.method) {
			case 'POST': {
				return await logoutRoute(req, res);
			}
		}
	}
);

async function logoutRoute(req: NextApiRequest, res: NextApiResponse) {
	try {
		// if (!req.session.user?.email) {
		// 	// throw new ApiError({
		// 	// 	statusCode: 401,
		// 	// 	message: 'student/unauthorized-access',
		// 	// });
		// 	return res
		// 		.status(204)
		// 		.json({ message: 'student/unauthorized-access' });
		// }
		req.session.destroy();
		deleteCookie('skill-matrix-student-reg-no', { req, res });
		return res.status(200).json({ message: 'student/logout-successful' });
	} catch (error) {
		console.log(error);
		if (error instanceof ApiError) {
			return res
				.status(error.statusCode)
				.json({ message: error.message, data: error.data });
		} else {
			return res
				.status(500)
				.json({ message: 'app/internal-server-error' });
		}
	}
}
