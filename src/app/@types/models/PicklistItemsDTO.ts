import { BaseDTO } from "src/app/@types/common/BaseDTO";

import { MaterialDTO } from "./MaterialDTO";
import { PicklistDTO } from "./PicklistDTO";

export interface PicklistItemsDTO extends BaseDTO {
	id: number | string;
	picklistId: number | string;
	picklistName: string;
	materialId: number | string | null;
	materialName: string;
	materialDescription: string;
	materialQuantity: number;
	pickedQuantity: number;
	picklistItemStatus: "Pending" | "In Progress" | "Completed";
	picklist?: PicklistDTO;
	material?: MaterialDTO;
}
