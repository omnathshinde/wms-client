import { DatePipe } from "@angular/common";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from "@angular/core";
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, provideNativeDateAdapter } from "@angular/material/core";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideRouter } from "@angular/router";
import { provideToastr } from "ngx-toastr";

import { API_URL, APP_CONFIG } from "src/app/app";
import { routes } from "src/app/app.routes";
import { AuthInterceptor } from "src/app/core/auth/auth.interceptor";
import { CUSTOM_DATE_FORMATS } from "src/app/core/configs/date.module";
import { ErrorInterceptor } from "src/app/core/interceptors/error.interceptor";
import { LoadingInterceptor } from "src/app/core/interceptors/loading.interceptor";
import { RetryInterceptor } from "src/app/core/interceptors/retry.interceptor";
import { environment } from "src/environments/environment";

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
		DatePipe,
	],
};
