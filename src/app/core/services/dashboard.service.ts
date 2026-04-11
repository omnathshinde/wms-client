import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { API_URL } from "@app/app";

export interface DashboardData {
	inventory: number;
	material: number;
	qc: {
		total: number;
		pending: number;
		approved: number;
		rejected: number;
	};
}

@Injectable({ providedIn: "root" })
export class DashboardService {
	private http = inject(HttpClient);
	private apiUrl = inject(API_URL);

	getAll(): Observable<DashboardData> {
		return this.http.get<DashboardData>(`${this.apiUrl}/dashboard`);
	}
}
