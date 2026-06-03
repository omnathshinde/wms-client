import { Component, inject, InjectionToken } from "@angular/core";
import { RouterOutlet } from "@angular/router";

import { AppConfig } from "src/app/@types/common/AppConfig";
import { ThemeService } from "src/app/core/services/theme.service";

@Component({
	selector: "app-root",
	imports: [RouterOutlet],
	styles: [
		`
			:host {
				display: block;
			}
		`,
	],
	template: `<router-outlet />`,
})
export class App {
	private readonly theme = inject(ThemeService);
	constructor() {
		this.theme.apply();
	}
}

export const APP_CONFIG = new InjectionToken<AppConfig>("app.config");
export const API_URL = new InjectionToken<string>("api.url");
