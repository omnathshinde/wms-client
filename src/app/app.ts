import { Component, InjectionToken } from "@angular/core";
import { RouterOutlet } from "@angular/router";

import { AppConfig } from "src/app/interfaces/common/AppConfig";

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
	template: `<router-outlet></router-outlet>`,
})
export class App {}

export const APP_CONFIG = new InjectionToken<AppConfig>("app.config");
export const API_URL = new InjectionToken<string>("api.url");
