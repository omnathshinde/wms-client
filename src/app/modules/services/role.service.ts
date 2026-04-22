import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { API_URL } from "src/app/app";
import { ApiResponse } from "src/app/interfaces/common/ApiResponse";

@Injectable({ providedIn: "root" })
export class RoleService {
	private readonly apiUrl = inject(API_URL);
	private readonly http = inject(HttpClient);

	getAll<T>(query: string): Observable<ApiResponse<T>> {
		return this.http.get<ApiResponse<T>>(`${this.apiUrl}/role?${query}`);
	}

	search<T>(query: string): Observable<ApiResponse<T>> {
		return this.http.get<ApiResponse<T>>(`${this.apiUrl}/role/search/records${query}`);
	}

	getById<T>(id: number | string): Observable<T> {
		return this.http.get<T>(`${this.apiUrl}/role/${id}`);
	}

	create<T>(data: T): Observable<T> {
		return this.http.post<T>(`${this.apiUrl}/role`, data);
	}

	update<T>(id: number | string, data: T): Observable<T> {
		return this.http.put<T>(`${this.apiUrl}/role/${id}`, data);
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
