import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ApiResponse } from "src/app/@types/common/ApiResponse";
import { InwardDTO } from "src/app/@types/models/InwardDTO";
import { BaseService } from "src/app/ui/ui.service";

@Injectable({ providedIn: "root" })
export class PicklistItemBarcodeService extends BaseService {
	constructor() {
		super("picklist-items-barcode");
	}

	getAll<T>(query: string): Observable<ApiResponse<T>> {
		return this.http.get<ApiResponse<T>>(this.getUrl(`?${query}`));
	}

	search(query: string): Observable<ApiResponse<InwardDTO[]>> {
		return this.http.get<ApiResponse<InwardDTO[]>>(this.getUrl(`/search/records${query}`));
	}

	getById<T>(id: number | string): Observable<T> {
		return this.http.get<T>(`${this.apiUrl}/role/${id}`);
	}
}
