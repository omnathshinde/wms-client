import { BaseDTO } from "src/app/interfaces/common/BaseDTO";

import { RackDTO } from "./RackDTO";

export interface ShelfDTO extends BaseDTO {
	id: number | string;
	name: string;
	rackId?: number;
	rack?: RackDTO;
}
