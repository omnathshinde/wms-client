import { Component, inject, ViewChild } from "@angular/core";
import { MatDrawer } from "@angular/material/sidenav";

import { AppModule } from "src/app/core/configs/app.module";
import { Header } from "src/app/core/layout/root/header/header";
import { Navigation } from "src/app/core/layout/root/navigation/navigation";
import { LayoutService } from "src/app/core/shared/layout.service";
import { StateService } from "src/app/core/shared/state.service";

@Component({
	selector: "app-home",
	imports: [AppModule, Header, Navigation],
	templateUrl: "./home.html",
	styleUrl: "./home.scss",
})
export class Home {
	private readonly state = inject(StateService);
	private readonly layout = inject(LayoutService);

	readonly loading = this.state.loading;

	readonly isHandset = this.layout.isHandset;
	readonly isTablet = this.layout.isTablet;
	readonly isDesktop = this.layout.isDesktop;

	@ViewChild("drawer") drawer!: MatDrawer;

	toggleSidebar() {
		this.drawer.toggle();
	}
}
