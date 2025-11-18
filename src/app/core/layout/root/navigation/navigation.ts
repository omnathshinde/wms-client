import { Component, signal } from "@angular/core";

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
	navItems: NavItem[] = AppNavigation;

	// Track dropdown state
	openStates = signal<Record<string, boolean>>({});

	toggle(item: NavItem) {
		if (!item.children) return;
		this.openStates.update((s) => ({
			...s,
			[item.title]: !s[item.title],
		}));
	}

	isOpen(item: NavItem) {
		return this.openStates()[item.title];
	}
}
