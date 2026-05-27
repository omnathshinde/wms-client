import { HttpInterceptorFn, HttpResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { of, tap } from "rxjs";

import { CacheService } from "@core/services/cache.service";

export const CacheInterceptor: HttpInterceptorFn = (req, next) => {
	const cache = inject(CacheService);

	if (req.method === "GET") {
		const cached = cache.get(req.url);
		if (cached) return of(cached);
		return next(req).pipe(
			tap((event) => {
				if (event instanceof HttpResponse) {
					cache.set(req.url, event, 5 * 1000);
				}
			}),
		);
	}
	if (["POST", "PUT", "DELETE", "PATCH"].includes(req.method)) {
		cache.delete(req.url);
	}
	return next(req);
};
