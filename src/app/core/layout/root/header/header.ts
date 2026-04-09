import { Component, inject } from "@angular/core";

import { LayoutService } from "src/app/core/services/layout.service";
import { AppModule } from "@core/configs/app.module";
import { ThemeService } from "@core/services/theme.service";

@Component({
	selector: "app-header",
	imports: [AppModule],
	templateUrl: "./header.html",
	styleUrl: "./header.scss",
})
export class Header {
	layout = inject(LayoutService);
	theme = inject(ThemeService);
}
