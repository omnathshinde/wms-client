import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ApiMessage } from "src/app/@types/common/ApiMessage";
import { ApiResponse } from "src/app/@types/common/ApiResponse";
import { BaseService } from "src/app/ui/ui.service";

@Injectable({ providedIn: "root" })
export class InwardService extends BaseService {
	constructor() {
		super("inward");
	}

	getAll<T>(query: string): Observable<ApiResponse<T>> {
		return this.http.get<ApiResponse<T>>(this.getUrl(`?${query}`));
	}

	search<T>(query: string): Observable<ApiResponse<T>> {
		return this.http.get<ApiResponse<T>>(this.getUrl(`/search/records${query}`));
	}

	getById<T>(id: number | string): Observable<T> {
		return this.http.get<T>(`${this.apiUrl}/role/${id}`);
	}

	create<T>(data: T): Observable<ApiMessage> {
		return this.http.post<ApiMessage>(this.getUrl(), data);
	}

	update<T>(id: number | string, data: T): Observable<ApiMessage> {
		return this.http.put<ApiMessage>(this.getUrl(`/${id}`), data);
	}

	delete<T>(id: number | string): Observable<T> {
		return this.http.delete<T>(`${this.apiUrl}/role/${id}`);
	}

	restore<T>(id: number | string): Observable<T> {
		return this.http.patch<T>(`${this.apiUrl}/role/${id}`, {});
	}

	bulkCreate<T>(data: T[]): Observable<T[]> {
		return this.http.post<T[]>(`${this.apiUrl}/role/bulk-records`, data);
	}
}
