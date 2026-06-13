import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { API_URL } from "src/app/app";

export interface DashboardData {
	inventory: {
		total: number;
		inStock: number;
		outOfStock: number;
	};

	materials: {
		total: number;
	};

	qc: {
		total: number;
		pending: number;
		approved: number;
		rejected: number;
	};

	putaway: {
		pending: number;
		completed: number;
	};

	picking: {
		pending: number;
		completed: number;
	};

	dispatch: {
		total: number;
	};

	returns: {
		total: number;
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
