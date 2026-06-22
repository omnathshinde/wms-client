import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ApiMessage } from "src/app/@types/common/ApiMessage";
import { ApiResponse } from "src/app/@types/common/ApiResponse";
import { InwardDTO } from "src/app/@types/models/InwardDTO";
import { BaseService } from "src/app/ui/ui.service";

@Injectable({ providedIn: "root" })
export class PicklistPickerService extends BaseService {
	constructor() {
		super("picklist-picker");
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

	create<T>(data: T): Observable<ApiMessage> {
		return this.http.post<ApiMessage>(this.getUrl(), data);
	}
}
