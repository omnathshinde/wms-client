import { BaseDTO } from "src/app/interfaces/common/BaseDTO";

import { RackDTO } from "./RackDTO";

export interface ShelfDTO extends BaseDTO {
	id: number;
	name: string;
	rackId?: number;
	rack?: RackDTO;
}
