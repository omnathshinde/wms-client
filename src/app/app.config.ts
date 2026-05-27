import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from "@angular/core";
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, provideNativeDateAdapter } from "@angular/material/core";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideRouter } from "@angular/router";
import { provideToastr } from "ngx-toastr";

import { environment } from "src/environments/environment";
import { API_URL, APP_CONFIG } from "@app/app";
import { routes } from "@app/app.routes";
import { AuthInterceptor } from "@core/auth/auth.interceptor";
import { CUSTOM_DATE_FORMATS } from "@core/configs/date.module";
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

		provideAnimations(),
		provideToastr({
			positionClass: "toast-top-right",
			timeOut: 3000,
			preventDuplicates: true,
		}),
		provideNativeDateAdapter(),
		{ provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
		{ provide: MAT_DATE_LOCALE, useValue: "en-GB" },
	],
};
