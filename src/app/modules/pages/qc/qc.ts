import { Component } from "@angular/core";

import { AppComponent } from "@app/core/configs/app.component";
import { AppModule } from "@app/core/configs/app.module";
import { UiComponent } from "@app/ui/ui.component";

@Component({
	selector: "app-qc",
	imports: [AppModule, AppComponent],
	templateUrl: "./qc.html",
	styleUrl: "./qc.scss",
})
export class Qc extends UiComponent {}
