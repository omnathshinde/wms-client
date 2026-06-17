import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ApiMessage } from "src/app/@types/common/ApiMessage";
import { ApiResponse } from "src/app/@types/common/ApiResponse";
import { BaseService } from "src/app/ui/ui.service";

export interface BulkUploadPayload {
	customerName: string;
	materialName: string;
	availableQuantity?: number;
	quantity: number;
}
@Injectable({ providedIn: "root" })
export class PicklistService extends BaseService {
	constructor() {
		super("picklist");
	}

	getAll<T>(query: string): Observable<ApiResponse<T>> {
		return this.http.get<ApiResponse<T>>(this.getUrl(`?${query}`));
	}

	search<T>(query: string): Observable<ApiResponse<T>> {
		return this.http.get<ApiResponse<T>>(this.getUrl(`/search/records${query}`));
	}

	bulkUpload(payload: BulkUploadPayload[]): Observable<ApiMessage> {
		return this.http.post<ApiMessage>(this.getUrl(`/bulk-records`), payload);
	}
}
