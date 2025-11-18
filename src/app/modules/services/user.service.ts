import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { API_URL } from "src/app/app";
import { ApiResponse } from "src/app/interfaces/common/ApiResponse";

@Injectable({ providedIn: "root" })
export class UserService {
	private readonly apiUrl = inject(API_URL);
	private readonly http = inject(HttpClient);

	getAll<T>(): Observable<ApiResponse<T>> {
		return this.http.get<ApiResponse<T>>(`${this.apiUrl}/user`);
	}

	search<T>(): Observable<ApiResponse<T>> {
		return this.http.get<ApiResponse<T>>(`${this.apiUrl}/user/search/records`);
	}
}
