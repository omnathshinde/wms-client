import { BaseDTO } from "src/app/@types/common/BaseDTO";
import { InwardDTO } from "src/app/@types/models/InwardDTO";

export interface PutawayDTO extends BaseDTO {
	id: number;
	name: string;
	inwardId: number;
	zone: InwardDTO;
	currentShelfId: number;
	currentshelf: string;
	previousShelfId: number;
	previousShelf: string;
}
