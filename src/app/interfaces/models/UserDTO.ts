import { BaseDTO } from "src/app/interfaces/common/BaseDTO";
import { RoleDTO } from "src/app/interfaces/models/RoleDTO";

export interface UserDTO extends BaseDTO {
	id: number;
	name: string;
	username: string;
	roleId: number;
	employeeId?: string;
	role?: RoleDTO;
}
