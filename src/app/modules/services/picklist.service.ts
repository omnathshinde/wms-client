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

	create<T>(data: T): Observable<ApiMessage> {
		return this.http.post<ApiMessage>(this.getUrl(), data);
	}

	update<T>(id: number | string, data: T): Observable<ApiMessage> {
		return this.http.put<ApiMessage>(this.getUrl(`/${id}`), data);
	}

	delete(id: number | string): Observable<ApiMessage> {
		return this.http.delete<ApiMessage>(this.getUrl(`/${id}`));
	}

	bulkUpload(payload: BulkUploadPayload[]): Observable<ApiMessage> {
		return this.http.post<ApiMessage>(this.getUrl(`/bulk-records`), payload);
	}
}
