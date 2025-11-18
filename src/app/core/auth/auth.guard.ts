import { inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, UrlTree } from "@angular/router";

import { AuthService } from "src/app/core/auth/auth.service";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate, CanActivateChild {
	private readonly authService = inject(AuthService);
	private readonly router = inject(Router);

	canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
		return this.checkAuth(route);
	}

	canActivateChild(route: ActivatedRouteSnapshot): boolean | UrlTree {
		return this.checkAuth(route);
	}

	private checkAuth(route: ActivatedRouteSnapshot): boolean | UrlTree {
		const isAuth = this.authService.isAuthenticated();
		const currentPath = route.routeConfig?.path ?? "";

		if (isAuth && currentPath === "login") {
			return this.router.createUrlTree(["/"]);
		}

		if (!isAuth && currentPath !== "login") {
			return this.router.createUrlTree(["/login"]);
		}

		return true;
	}
}
