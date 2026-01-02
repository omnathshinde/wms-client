import { Component, inject, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { AppModule } from "src/app/core/configs/app.module";
import { AppNavigation } from "src/app/core/configs/app.navigation";

@Component({
	selector: "app-page-header",
	imports: [AppModule],
	templateUrl: "./page-header.html",
	styleUrl: "./page-header.scss",
})
export class PageHeader implements OnInit {
	breadcrumb = {
		path: [] as string[],
		last: "",
	};

	private router = inject(Router);
	ngOnInit(): void {
		const currentRoute = this.router.url;
		this.breadcrumb = this.getBreadcrumb(currentRoute);
	}

	private getBreadcrumb(url: string) {
		let found: string[] = [];

		for (const item of AppNavigation) {
			// TOP LEVEL
			if (item.route === url) {
				found = [item.title];
			}

			// CHILDREN
			if (item.children) {
				for (const child of item.children) {
					if (child.route === url) {
						found = [item.title, child.title];
					}
				}
			}
		}

		return {
			path: found,
			last: found[found.length - 1] ?? "",
		};
	}
}
