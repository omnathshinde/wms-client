import { BaseDTO } from "src/app/@types/common/BaseDTO";

import { SiteDTO } from "./SiteDTO";

export interface CustomerDTO extends BaseDTO {
	id: number | string;
	name: string;
	description?: string;
	siteId?: number;
	site?: SiteDTO;
}
