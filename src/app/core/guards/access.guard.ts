import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

import { AuthService } from "src/app/core/auth/auth.service";

export const AccessGuard: CanActivateFn = (route) => {
	const router = inject(Router);
	const toastr = inject(ToastrService);
	const authService = inject(AuthService);

	const requiredAccess = route.data?.["access"];
	const userAccess = authService.getAccess();
	if (!requiredAccess) {
		return true;
	}

	if (userAccess.includes(requiredAccess)) {
		return true;
	}
	toastr.error("You do not have access");
	router.navigate(["/dashboard"]);
	return false;
};
