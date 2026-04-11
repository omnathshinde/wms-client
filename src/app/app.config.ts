import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from "@angular/core";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideRouter } from "@angular/router";
import { provideToastr } from "ngx-toastr";

import { environment } from "src/environments/environment";
import { API_URL, APP_CONFIG } from "@app/app";
import { routes } from "@app/app.routes";
import { AuthInterceptor } from "@core/auth/auth.interceptor";
import { ErrorInterceptor } from "@core/interceptors/error.interceptor";
import { LoadingInterceptor } from "@core/interceptors/loading.interceptor";
import { RetryInterceptor } from "@core/interceptors/retry.interceptor";

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		provideZonelessChangeDetection(),
		provideAnimationsAsync(),
		provideRouter(routes),
		provideHttpClient(
			withInterceptors([
				AuthInterceptor,
				// CacheInterceptor,
				LoadingInterceptor,
				RetryInterceptor,
				ErrorInterceptor,
			]),
		),
		{ provide: APP_CONFIG, useValue: environment },
		{ provide: API_URL, useValue: environment.apiUrl },
		provideToastr({
			positionClass: "toast-top-right",
			timeOut: 3000,
			preventDuplicates: true,
		}),
	],
};
