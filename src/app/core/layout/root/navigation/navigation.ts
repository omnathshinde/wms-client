import { Component, inject, signal } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs";

import { NavItem } from "src/app/@types/common/NavItem";
import { AuthService } from "src/app/core/auth/auth.service";
import { AppModule } from "src/app/core/configs/app.module";
import { AppNavigation } from "src/app/core/configs/app.navigation";
import { ListItemFocusable } from "src/app/shared/directives/list-item-focusable.directive";
import { NavActiveDirective } from "src/app/shared/directives/nav-active.directive";
import { NavListKeyManager } from "src/app/shared/directives/nav-list-key-manager.directive";

@Component({
	selector: "app-navigation",
	imports: [AppModule, ListItemFocusable, NavListKeyManager, NavActiveDirective],
	templateUrl: "./navigation.html",
	styleUrl: "./navigation.scss",
})
export class Navigation {
	private router = inject(Router);
	private authService = inject(AuthService);
	navItems: NavItem[] = AppNavigation;
	openMap = signal<Record<string, boolean>>({});
	private parentMap = new Map<string, string>();
	filteredNavItems: NavItem[] = [];

	constructor() {
		this.filterNavigation();
		this.buildParentMap();
		this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => this.syncMenuWithRoute());
		this.syncMenuWithRoute();
	}

	private filterNavigation(): void {
		const accesses = this.authService.getAccess();

		this.filteredNavItems = this.navItems
			.map((item) => {
				// parent without children
				if (!item.children) {
					if (item.title === "Dashboard") {
						return item;
					}
					return accesses.includes(item.access || "") ? item : null;
				}
				// filter children
				const children = item.children.filter((child) => accesses.includes(child.access || ""));
				// hide parent if empty
				if (!children.length) {
					return null;
				}
				return { ...item, children };
			})
			.filter((item): item is NavItem => item !== null);
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
