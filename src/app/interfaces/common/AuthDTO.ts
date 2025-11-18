export interface AuthDTO {
	id: string;
	username: string;
	password?: string;
	email: string;
	role: string;
	roleId: string;
	siteId: string | null;
	token: string;
}
