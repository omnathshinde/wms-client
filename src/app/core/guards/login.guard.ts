import { inject, Injectable } from "@angular/core";
import { CanActivate, Router, UrlTree } from "@angular/router";

import { AuthService } from "src/app/core/auth/auth.service";

@Injectable({ providedIn: "root" })
export class LoginGuard implements CanActivate {
	private readonly auth = inject(AuthService);
	private readonly router = inject(Router);

	canActivate(): boolean | UrlTree {
		if (this.auth.isAuthenticated()) {
			return this.router.createUrlTree(["/dashboard"]);
		}

		return true;
	}
}
