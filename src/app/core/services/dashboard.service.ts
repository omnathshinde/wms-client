import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { API_URL } from "src/app/app";

export interface DashboardData {
	masterData: {
		customers: number;

		materials: {
			total: number;
			inStock: number;
			outOfStock: number;
		};

		locations: {
			sites: number;
			zones: number;
			racks: number;
			shelves: number;
			utilizationPercentage: number;
		};
	};

	inbound: {
		inventory: {
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
	};

	outbound: {
		stockMovement: {
			picked: number;
			issued: number;
		};
		picklist: {
			total: number;
			pending: number;
			inProgress: number;
			completed: number;
			issued: number;
		};
		dispatch: {
			total: number;
			pending: number;
			dispatched: number;
		};
	};

	returns: {
		total: number;
	};

	audit: {
		total: number;
		pending: number;
		inProgress: number;
		completed: number;
	};

	today: {
		inward: number;
		qc: number;
		putaway: number;
		picklist: number;
		dispatch: number;
		returns: number;
		audits: number;
	};
}

@Injectable({ providedIn: "root" })
export class DashboardService {
	private http = inject(HttpClient);
	private apiUrl = inject(API_URL);

	getAll(query: string): Observable<DashboardData> {
		return this.http.get<DashboardData>(`${this.apiUrl}/dashboard?` + query);
	}
}
