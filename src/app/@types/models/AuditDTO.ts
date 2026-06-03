import { BaseDTO } from "src/app/@types/common/BaseDTO";
import { SiteDTO } from "src/app/@types/models/SiteDTO";

export interface AuditDTO extends BaseDTO {
	id: number;
	name: string;
	number: string;
	startBy: string;
	startAt: Date;
	endBy: string;
	endAt: Date;
	auditStatus: string;
	siteId: number;
	site: SiteDTO;
}
