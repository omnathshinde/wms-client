import { bootstrapApplication } from "@angular/platform-browser";

import { App } from "@app/app";
import { appConfig } from "@app/app.config";

bootstrapApplication(App, appConfig)
	.then(() => {
		document.body.classList.add("fade-out");
		setTimeout(() => {
			const splash = document.getElementById("splash");
			if (splash) splash.remove();
			document.body.classList.add("loaded");
		}, 400);
	})
	.catch((err) => console.error(err));
