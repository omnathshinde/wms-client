import { BaseDTO } from "src/app/interfaces/common/BaseDTO";
import { SiteDTO } from "src/app/interfaces/models/SiteDTO";

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
