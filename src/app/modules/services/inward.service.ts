import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ApiResponse } from "src/app/interfaces/common/ApiResponse";
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
}
