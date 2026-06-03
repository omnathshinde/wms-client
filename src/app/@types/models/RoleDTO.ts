import { BaseDTO } from "src/app/@types/common/BaseDTO";

export interface RoleDTO extends BaseDTO {
	id: number | string;
	name: string;
}
