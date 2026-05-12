import { BaseDTO } from "src/app/interfaces/common/BaseDTO";

import { SiteDTO } from "./SiteDTO";

export interface ZoneDTO extends BaseDTO {
	id: number;
	name: string;
	siteId?: number;
	site?: SiteDTO;
}
