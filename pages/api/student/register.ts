import { withSessionRoute } from '@/utils/withSession';
import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import ApiError from '@/utils/apiError';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';

export default withSessionRoute(
	async (req: NextApiRequest, res: NextApiResponse) => {
		switch (req.method) {
			case 'POST': {
				return await registerRoute(req, res);
			}
		}
	}
);

const registerBodySchema = z.object({
	email: z.string().email(),
	phone: z.string(),
	name: z.string(),
	regNo: z.string(),
});

interface RegisterStudentApiRequest extends NextApiRequest {
	body: z.infer<typeof registerBodySchema>;
}

async function registerRoute(
	req: RegisterStudentApiRequest,
	res: NextApiResponse
) {
	try {
		const { email, phone, name, regNo } = req.body;
		const valid = registerBodySchema.safeParse(req.body);
		if (!valid.success) {
			throw new ApiError({ message: 'Invalid data', statusCode: 400 });
		}
		await updateDoc(doc(db, 'students', email), {
			phone,
			name,
			regNo,
		});
		req.session = { ...req.session, user: { email: email } };
		await req.session.save();
		return res
			.status(201)
			.json({ message: 'student/registration-successful' });
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
