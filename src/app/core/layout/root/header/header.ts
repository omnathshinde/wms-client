import { Component, EventEmitter, inject, Output } from "@angular/core";

import { AppModule } from "src/app/core/configs/app.module";
import { ThemeService } from "src/app/core/shared/theme.service";

@Component({
	selector: "app-header",
	imports: [AppModule],
	templateUrl: "./header.html",
	styleUrl: "./header.scss",
})
export class Header {
	theme = inject(ThemeService);
	@Output() toggleSidebar = new EventEmitter<void>();
}
