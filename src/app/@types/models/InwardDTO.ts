import { BaseDTO } from "src/app/@types/common/BaseDTO";
import { MaterialDTO } from "src/app/@types/models/MaterialDTO";
import { SiteDTO } from "src/app/@types/models/SiteDTO";

export interface InwardDTO extends BaseDTO {
	id: number;
	siteId: number;
	barcode: string;
	autoSerial: boolean;
	materialId: number;
	materialName: string;
	materialDescription: string;
	mrp: string;
	quantity: number;
	batch: string;
	invoice: string;
	manufacturingDate: Date;
	qcStatus: string;
	qcRemark: null;
	isPutAway: boolean;
	shelfId: number;
	shelfName: string;
	recommandedShelf: string;
	isPicked: boolean;
	pickerId: number;
	picklistId: number;
	picklistName: string;
	pickedBy: string;
	isDispatch: boolean;
	isReturn: boolean;
	inStock: boolean;
	site: SiteDTO;
	material: MaterialDTO;
}
