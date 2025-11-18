import { HttpInterceptorFn } from "@angular/common/http";
import { retry } from "rxjs";

export const RetryInterceptor: HttpInterceptorFn = (req, next) => {
	return next(req).pipe(retry(2));
};
