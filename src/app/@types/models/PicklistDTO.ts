import { BaseDTO } from "src/app/@types/common/BaseDTO";

import { CustomerDTO } from "./CustomerDTO";
import { UserDTO } from "./UserDTO";

export interface PicklistDTO extends BaseDTO {
	id: number | string;
	name: string;
	siteId: number | string;
	userId: number | string | null;
	customerId: number | string;
	picklistStatus: "Pending" | "In Progress" | "Completed" | "Issued";
	isIssued: boolean;
	startedBy: string;
	startedAt: Date;
	completedBy: string;
	completedAt: Date;
	issueDate: Date;
	issueBy: string;
	isPartial: boolean;
	invoice: string;
	vehicleNo: string;
	customer?: CustomerDTO;
	user?: UserDTO;
}
