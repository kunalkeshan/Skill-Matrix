import { withSessionRoute } from '@/utils/withSession';
import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import ApiError from '@/utils/apiError';
import { AppRegEx } from '@/config';

export default withSessionRoute(
	async (req: NextApiRequest, res: NextApiResponse) => {
		switch (req.method) {
			case 'POST': {
				return await loginRoute(req, res);
			}
		}
	}
);

const loginBodySchema = z.object({
	email: z.string().email(),
	token: z.string(),
});

interface LoginStudentApiRequest extends NextApiRequest {
	body: z.infer<typeof loginBodySchema>;
}

async function loginRoute(req: LoginStudentApiRequest, res: NextApiResponse) {
	try {
		const { email } = req.body;
		const valid = loginBodySchema.safeParse(req.body);
		if (!valid.success || !AppRegEx.studentCollegeEmail.test(email))
			throw new ApiError({
				statusCode: 400,
				message: 'student/invalid-email-type',
			});
		req.session = { ...req.session, user: { email } };
		await req.session.save();
		return res.status(200).json({ message: 'student/login-successful' });
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
