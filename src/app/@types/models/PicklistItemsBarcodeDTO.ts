import { BaseDTO } from "src/app/@types/common/BaseDTO";

import { PicklistItemsDTO } from "./PicklistItemsDTO";

export interface PicklistItemsBarcodeDTO extends BaseDTO {
	id: number | string;
	picklistId: number | string | null;
	picklistName: string;
	materialName: string;
	picklistItemId: number | string | null;
	inwardId: number | string;
	barcode: string;
	quantity: number;
	shelf: string;
	customerId: number | string;
	picklistStatus: "Pending" | "In Progress" | "Completed" | "Issued";
	isIssued: boolean;
	picklistItem?: PicklistItemsDTO;
}
