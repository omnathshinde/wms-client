import { Component, Input } from "@angular/core";

import { AppComponent } from "src/app/core/configs/app.component";
import { AppModule } from "src/app/core/configs/app.module";

@Component({
	selector: "app-header-container",
	imports: [AppModule, AppComponent],
	templateUrl: "./header-container.html",
	styleUrl: "./header-container.scss",
})
export class HeaderContainer {
	@Input() title = "";
}
