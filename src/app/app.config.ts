import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from "@angular/core";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideRouter } from "@angular/router";
import { provideToastr } from "ngx-toastr";

import { API_URL, APP_CONFIG } from "src/app/app";
import { routes } from "src/app/app.routes";
import { AuthInterceptor } from "src/app/core/auth/auth.interceptor";
import { CacheInterceptor } from "src/app/core/interceptors/cache.interceptor";
import { ErrorInterceptor } from "src/app/core/interceptors/error.interceptor";
import { LoadingInterceptor } from "src/app/core/interceptors/loading.interceptor";
import { RetryInterceptor } from "src/app/core/interceptors/retry.interceptor";
import { environment } from "src/environments/environment";

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		provideZonelessChangeDetection(),

		provideRouter(routes),
		provideHttpClient(
			withInterceptors([
				AuthInterceptor,
				LoadingInterceptor,
				ErrorInterceptor,
				CacheInterceptor,
				RetryInterceptor,
			]),
		),
		{ provide: APP_CONFIG, useValue: environment },
		{ provide: API_URL, useValue: environment.apiUrl },

		provideAnimations(),
		provideToastr({
			positionClass: "toast-top-right",
			timeOut: 3000,
			preventDuplicates: true,
		}),
	],
};
