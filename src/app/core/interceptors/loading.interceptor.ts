import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { finalize } from "rxjs";

import { StateService } from "@core/services/state.service";

export const LoadingInterceptor: HttpInterceptorFn = (req, next) => {
	const state = inject(StateService);
	state.beginRequest();
	return next(req).pipe(finalize(() => state.endRequest()));
};
