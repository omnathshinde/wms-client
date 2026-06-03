import { BaseDTO } from "src/app/@types/common/BaseDTO";
import { RoleDTO } from "src/app/@types/models/RoleDTO";
import { SiteDTO } from "src/app/@types/models/SiteDTO";

export interface UserDTO extends BaseDTO {
	id: number | string;
	name: string;
	username: string;
	roleid: number | string;
	employeeId?: string;
	role?: RoleDTO;
	site?: SiteDTO;
}
