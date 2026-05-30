import { BaseDTO } from "src/app/interfaces/common/BaseDTO";
import { InwardDTO } from "src/app/interfaces/models/InwardDTO";

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
