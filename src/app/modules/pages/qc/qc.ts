import { Component } from "@angular/core";

import { AppComponent } from "src/app/core/configs/app.component";
import { AppModule } from "src/app/core/configs/app.module";
import { UiComponent } from "src/app/ui/ui.component";

@Component({
	selector: "app-qc",
	imports: [AppModule, AppComponent],
	templateUrl: "./qc.html",
	styleUrl: "./qc.scss",
})
export class Qc extends UiComponent {}
