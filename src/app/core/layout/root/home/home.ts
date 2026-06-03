import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule } from "@angular/material/chips";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatSpinner } from "@angular/material/progress-spinner";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterOutlet } from "@angular/router";

import { Header } from "src/app/core/layout/root/header/header";
import { Navigation } from "src/app/core/layout/root/navigation/navigation";
import { LayoutService } from "src/app/core/services/layout.service";
import { StateService } from "src/app/core/services/state.service";

@Component({
	selector: "app-home",
	imports: [
		RouterOutlet,
		CommonModule,
		MatToolbarModule,
		MatSidenavModule,
		MatButtonModule,
		MatIconModule,
		MatListModule,
		MatCardModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		MatCheckboxModule,
		MatRadioModule,
		MatTabsModule,
		MatTableModule,
		MatChipsModule,
		MatMenuModule,
		MatTooltipModule,
		MatSlideToggleModule,
		Navigation,
		Header,
		MatSpinner,
	],
	templateUrl: "./home.html",
	styleUrl: "./home.scss",
})
export class Home {
	layout = inject(LayoutService);
	state = inject(StateService);
	readonly loading = this.state.loading;
}
