import { Component, inject, OnInit, signal } from "@angular/core";

import { AppModule } from "src/app/core/configs/app.module";
import { DashboardData, DashboardService } from "src/app/core/services/dashboard.service";

@Component({
	selector: "app-dashboard",
	imports: [AppModule],
	templateUrl: "./dashboard.html",
	styleUrl: "./dashboard.scss",
})
export class Dashboard implements OnInit {
	private dashboard = inject(DashboardService);

	data = signal<DashboardData | null>(null);

	ngOnInit(): void {
		this.dashboard.getAll().subscribe((res: DashboardData) => {
			this.data.set(res);
		});
	}
}
