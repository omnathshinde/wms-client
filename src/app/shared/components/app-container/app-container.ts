import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { MatCard } from "@angular/material/card";

@Component({
	selector: "app-container",
	imports: [CommonModule, MatCard],
	templateUrl: "./app-container.html",
	styleUrl: "./app-container.scss",
})
export class AppContainer {
	@Input() cardClass = "";
}
