import { OverlayContainer } from "@angular/cdk/overlay";
import { CommonModule } from "@angular/common";
import { Component, DOCUMENT, inject, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule } from "@angular/material/chips";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterOutlet } from "@angular/router";

import { environment } from "src/environments/environment";

import { ThemeService } from "./theme.service";

@Component({
	selector: "app-root",
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
	],
	templateUrl: "./app.html",
	styleUrl: "./app.scss",
})
export class App {
	private readonly document = inject(DOCUMENT);
	private readonly overlayContainer = inject(OverlayContainer);
	protected readonly themeService = inject(ThemeService);
	private _snackBar = inject(MatSnackBar);

	openSnackBar(message: string, action: string) {
		this._snackBar.open(message, action);
	}

	protected readonly title = signal(environment.apiUrl);
	name = "Omnath Shinde";

	isDarkTheme = false;

	users: { name: string; role: string; active: boolean }[] = [
		{ name: "Omnath", role: "Angular Dev", active: true },
		{ name: "Rahul", role: "Backend Dev", active: false },
	];

	displayedColumns: string[] = ["name", "role", "active"];
}
