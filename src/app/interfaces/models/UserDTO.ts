import { BaseDTO } from "src/app/interfaces/common/BaseDTO";
import { RoleDTO } from "src/app/interfaces/models/RoleDTO";

export interface UserDTO extends BaseDTO {
	id: number | string;
	name: string;
	username: string;
	roleid: number | string;
	employeeId?: string;
	role?: RoleDTO;
}
