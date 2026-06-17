import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ApiMessage } from "src/app/@types/common/ApiMessage";
import { ApiResponse } from "src/app/@types/common/ApiResponse";
import { BaseService } from "src/app/ui/ui.service";

@Injectable({ providedIn: "root" })
export class QcService extends BaseService {
	constructor() {
		super("qc");
	}

	getAll<T>(query: string): Observable<ApiResponse<T>> {
		return this.http.get<ApiResponse<T>>(this.getUrl(`?${query}`));
	}

	search<T>(query: string): Observable<ApiResponse<T>> {
		return this.http.get<ApiResponse<T>>(this.getUrl(`/search/records${query}`));
	}

	getById<T>(id: number | string): Observable<T> {
		return this.http.get<T>(this.getUrl(`/${id}`));
	}

	create<T>(data: T): Observable<ApiMessage> {
		return this.http.post<ApiMessage>(this.getUrl(), data);
	}

	bulkCreate<T>(data: T[]): Observable<T[]> {
		return this.http.post<T[]>(this.getUrl("/bulk-records"), data);
	}
}
