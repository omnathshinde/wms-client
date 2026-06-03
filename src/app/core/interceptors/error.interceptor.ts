import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { catchError, throwError } from "rxjs";

import { StateService } from "src/app/core/services/state.service";

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
	const state = inject(StateService);
	state.clearError();
	const toast = inject(ToastrService);
	return next(req).pipe(
		catchError((error: HttpErrorResponse) => {
			let message = "Unexpected error occurred";
			let status = 0;

			if (error instanceof HttpErrorResponse) {
				status = error.status;
				if (error.error && typeof error.error === "object" && "message" in error.error) {
					message = (error.error as { message: string }).message;
				} else if (error.message) {
					message = error.message;
				} else {
					message = `HTTP ${error.status} - ${error.statusText}`;
				}
			}

			state.setError(message + status);
			toast.error(message);
			return throwError(() => error);
		}),
	);
};
