import { HttpClient } from "@angular/common/http";
import { computed, inject, Injectable, signal } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Observable, tap } from "rxjs";

import { API_URL } from "src/app/app";

export interface AuthUser {
	id: string;
	username: string;
	employeeId?: string;
	email?: string;
	role?: string;
	roleId: string;
	siteId: string | null;
}

export interface AuthResponse {
	token: string;
	user: AuthUser;
	access: string[];
}

@Injectable({ providedIn: "root" })
export class AuthService {
	private readonly http = inject(HttpClient);
	private readonly router = inject(Router);
	private readonly toastr = inject(ToastrService);
	private readonly apiUrl = inject(API_URL);

	// 🔐 Signals with localStorage / sessionStorage persistence
	private readonly _token = signal<string | null>(sessionStorage.getItem("token"));
	private readonly _user = signal<AuthUser | null>(JSON.parse(sessionStorage.getItem("authUser") || "null"));
	private readonly _access = signal<string[]>(JSON.parse(sessionStorage.getItem("authAccess") || "[]"));

	readonly token = this._token.asReadonly();
	readonly user = this._user.asReadonly();
	readonly access = this._access.asReadonly();
	readonly isAuthenticated = computed(() => !!this._token());

	// ✅ LOGIN
	login(payload: { username: string; password: string }): Observable<AuthResponse> {
		return this.http.post<AuthResponse>(`${this.apiUrl}/sign_in`, payload).pipe(
			tap((res) => {
				// Save in signals
				this._token.set(res.token);
				this._user.set(res.user);
				this._access.set(res.access);

				// Persist to storage
				sessionStorage.setItem("token", res.token);
				sessionStorage.setItem("authUser", JSON.stringify(res.user));
				sessionStorage.setItem("authAccess", JSON.stringify(res.access));
				this.toastr.success(`Welcome ${res.user.username}`);
			}),
		);
	}

	// ✅ LOGOUT
	logout(): void {
		this._token.set(null);
		this._user.set(null);
		this._access.set([]);

		sessionStorage.removeItem("token");
		sessionStorage.removeItem("authUser");
		sessionStorage.removeItem("authAccess");

		this.router.navigateByUrl("/login");
		this.toastr.info("You have been logged out");
	}

	// ✅ GETTERS
	getToken(): string | null {
		return this._token();
	}

	getUser(): AuthUser | null {
		return this._user();
	}

	getAccess(): string[] {
		return this._access();
	}

	// ✅ Restore state after reload
	restoreSession(): boolean {
		const token = sessionStorage.getItem("token");
		const user = sessionStorage.getItem("authUser");
		const access = sessionStorage.getItem("authAccess");

		if (token && user) {
			this._token.set(token);
			this._user.set(JSON.parse(user));
			this._access.set(JSON.parse(access || "[]"));
			return true;
		}
		return false;
	}
}
