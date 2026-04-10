import { Component, inject, signal } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs";

import { AppModule } from "src/app/core/configs/app.module";
import { AppNavigation } from "src/app/core/configs/app.navigation";
import { NavItem } from "src/app/interfaces/common/NavItem";

@Component({
	selector: "app-navigation",
	imports: [AppModule],
	templateUrl: "./navigation.html",
	styleUrl: "./navigation.scss",
})
export class Navigation {
	private router = inject(Router);
	navItems: NavItem[] = AppNavigation;
	openMap = signal<Record<string, boolean>>({});
	private parentMap = new Map<string, string>();

	constructor() {
		this.buildParentMap();
		this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => this.syncMenuWithRoute());
		this.syncMenuWithRoute();
	}

	private buildParentMap(): void {
		this.navItems.forEach((item) => {
			item.children?.forEach((child) => {
				if (child.route) {
					this.parentMap.set(child.route, item.title);
				}
			});
		});
	}

	toggle(id: string): void {
		this.openMap.update((state) => ({
			...state,
			[id]: !state[id],
		}));
	}

	isOpen(item: NavItem): boolean {
		return !!this.openMap()[item.title];
	}

	isParentActive(item: NavItem): boolean {
		return item.children?.some((child) => this.router.url.startsWith(child.route || "")) ?? false;
	}

	private syncMenuWithRoute(): void {
		const url = this.router.url;
		const newState: Record<string, boolean> = {};
		for (const [route, parentId] of this.parentMap.entries()) {
			if (url.startsWith(route)) {
				newState[parentId] = true;
			}
		}
		this.openMap.set(newState);
	}

	trackByKey(index: number, item: NavItem): string {
		return item.title;
	}
}
