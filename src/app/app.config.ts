import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from "@angular/core";
import { provideRouter } from "@angular/router";
import { provideToastr } from "ngx-toastr";

import { routes } from "@app/app.routes";

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		provideZonelessChangeDetection(),
		provideRouter(routes),
		provideToastr({
			positionClass: "toast-top-right",
			timeOut: 3000,
			preventDuplicates: true,
		}),
	],
};
