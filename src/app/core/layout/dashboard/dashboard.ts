import { Component } from "@angular/core";

import { AppModule } from "src/app/core/configs/app.module";

@Component({
	selector: "app-dashboard",
	imports: [AppModule],
	templateUrl: "./dashboard.html",
	styleUrl: "./dashboard.scss",
})
export class Dashboard {}
