import { Component, Input } from "@angular/core";

import { AppModule } from "src/app/core/configs/app.module";

export interface Breadcrumb {
	label?: string;
	route?: string;
}

@Component({
	selector: "app-page-header",
	imports: [AppModule],
	templateUrl: "./page-header.html",
	styleUrl: "./page-header.scss",
})
export class PageHeader {
	@Input() breadcrumbs: Breadcrumb[] = [{ label: "Home", route: "/" }];
	@Input() title = "Page Title";
}
