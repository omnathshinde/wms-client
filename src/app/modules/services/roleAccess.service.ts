import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ApiMessage } from "src/app/@types/common/ApiMessage";
import { ApiResponse } from "src/app/@types/common/ApiResponse";
import { BaseService } from "src/app/ui/ui.service";

export interface RoleAccess {
	name: string;
	accessId: number | string;
	roleId: number | string;
	status: number | string;
}

@Injectable({ providedIn: "root" })
export class RoleAccessService extends BaseService {
	constructor() {
		super("roleAccess");
	}

	getAll<RoleAccess>(query: string): Observable<ApiResponse<RoleAccess>> {
		return this.http.get<ApiResponse<RoleAccess>>(this.getUrl(`?${query}`));
	}

	create<T>(data: T): Observable<ApiMessage> {
		return this.http.post<ApiMessage>(this.getUrl(), data);
	}
}
