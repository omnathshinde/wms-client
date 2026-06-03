import { BaseDTO } from "src/app/@types/common/BaseDTO";

export interface SiteDTO extends BaseDTO {
	id: number | string;
	name: string;
}
