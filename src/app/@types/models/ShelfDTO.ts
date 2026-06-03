import { BaseDTO } from "src/app/@types/common/BaseDTO";

import { RackDTO } from "./RackDTO";

export interface ShelfDTO extends BaseDTO {
	id: number | string;
	name: string;
	barcode: string;
	description?: string;
	capacity?: number;
	loadedCapacity?: number;
	volume?: number;
	loadedVolume?: number;
	rackId?: number;
	rack?: RackDTO;
}
