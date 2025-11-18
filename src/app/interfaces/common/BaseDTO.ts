export interface BaseDTO {
	createdAt?: Date;
	updatedAt?: Date;
	deletedAt?: Date | null;
	createdBy?: string;
	updatedBy?: string;
	deletedBy?: string | null;
}
