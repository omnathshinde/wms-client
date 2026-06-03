import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ApiResponse } from "src/app/@types/common/ApiResponse";
import { InwardDTO } from "src/app/@types/models/InwardDTO";
import { BaseService } from "src/app/ui/ui.service";

export interface BulkUploadPayload {
	barcodes: string[];
	shelfId: string | number | null;
	shelfName: string;
}
@Injectable({ providedIn: "root" })
export class PutawayService extends BaseService {
	constructor() {
		super("putaway");
	}

	getAll<T>(query: string): Observable<ApiResponse<T>> {
		return this.http.get<ApiResponse<T>>(this.getUrl(`?${query}`));
	}

	search(query: string): Observable<ApiResponse<InwardDTO[]>> {
		return this.http.get<ApiResponse<InwardDTO[]>>(this.getUrl(`/search/records${query}`));
	}

	bulkUpload(payload: BulkUploadPayload): Observable<ApiResponse<InwardDTO[]>> {
		return this.http.post<ApiResponse<InwardDTO[]>>(this.getUrl(`/bulk-records`), payload);
	}
}
