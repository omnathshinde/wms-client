import { BaseDTO } from "src/app/interfaces/common/BaseDTO";
import { RoleDTO } from "src/app/interfaces/models/RoleDTO";
import { SiteDTO } from "src/app/interfaces/models/SiteDTO";

export interface UserDTO extends BaseDTO {
	id: number | string;
	name: string;
	username: string;
	roleid: number | string;
	employeeId?: string;
	role?: RoleDTO;
	site?: SiteDTO;
}
