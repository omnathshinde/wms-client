import { BaseDTO } from "src/app/@types/common/BaseDTO";

import { ZoneDTO } from "./ZoneDTO";

export interface RackDTO extends BaseDTO {
	id: number | string;
	name: string;
	zoneId?: number;
	zone?: ZoneDTO;
}
