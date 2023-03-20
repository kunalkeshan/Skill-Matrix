interface Student {
	name: string;
	regNo: string;
	email: string;
	avatar: string;
	phone?: string;
	department?: string;
	about?: string;
	campus?: string;
	socials?: {
		resume: string;
		instagram: string;
		linkedin: string;
		github: string;
	};
}

interface Faculty {}
