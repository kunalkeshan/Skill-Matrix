import { withSessionRoute } from '@/utils/withSession';
import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import ApiError from '@/utils/apiError';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';
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

interface LoginAdminApiRequest extends NextApiRequest {
	body: z.infer<typeof loginBodySchema>;
}

async function loginRoute(req: LoginAdminApiRequest, res: NextApiResponse) {
	try {
		const { email, token } = req.body;
		const valid = loginBodySchema.safeParse(req.body);
		console.log(
			req.body,
			AppRegEx.studentCollegeEmail.test(email),
			!valid.success || !AppRegEx.studentCollegeEmail.test(email)
		);
		if (!valid.success || !AppRegEx.studentCollegeEmail.test(email))
			throw new ApiError({
				statusCode: 400,
				message: 'student/invalid-email-type',
			});
		const docRef = doc(db, 'students', email);
		const docSnap = await getDoc(docRef);
		if (docSnap.exists()) {
			// req.session = { ...req.session, user: { email, token } };
			// await req.session.save();
			return res
				.status(200)
				.json({ message: 'student/login-successful' });
		} else {
			return res
				.status(200)
				.json({ message: 'student/onboard-redirect' });
		}
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
