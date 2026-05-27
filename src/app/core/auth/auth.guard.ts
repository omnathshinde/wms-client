import { inject, Injectable } from "@angular/core";
import {
	ActivatedRouteSnapshot,
	CanActivate,
	CanActivateChild,
	Router,
	RouterStateSnapshot,
	UrlTree,
} from "@angular/router";

import { AuthService } from "./auth.service";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate, CanActivateChild {
	private readonly authService = inject(AuthService);
	private readonly router = inject(Router);

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
		return this.checkAuth(state);
	}

	canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
		return this.checkAuth(state);
	}

	private checkAuth(state: RouterStateSnapshot): boolean | UrlTree {
		if (this.authService.isAuthenticated()) {
			return true;
		}

		const returnUrl = state.url !== "/login" ? state.url : "/dashboard";

		return this.router.createUrlTree(["/login"], {
			queryParams: { returnUrl },
		});
	}
}
