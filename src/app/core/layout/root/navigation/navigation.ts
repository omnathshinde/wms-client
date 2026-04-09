import { Component } from "@angular/core";

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
	openMap: Record<string, boolean> = {};

	toggle(key: string): void {
		this.openMap[key] = !this.openMap[key];
	}

	isOpen(item: NavItem): boolean {
		return !!this.openMap[item.title];
	}

	trackByKey(index: number, item: NavItem): string {
		return item.title;
	}
}
