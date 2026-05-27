import { HttpClient } from "@angular/common/http";
import { inject } from "@angular/core";

import { API_URL } from "src/app/app";

export abstract class BaseService {
	protected readonly http = inject(HttpClient);
	protected readonly apiUrl = inject(API_URL);

	constructor(private endpoint: string) {}

	protected getUrl(path = ""): string {
		return `${this.apiUrl}/${this.endpoint}${path}`;
	}
}
