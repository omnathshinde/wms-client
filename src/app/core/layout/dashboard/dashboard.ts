import { Component, OnInit, signal } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { debounceTime } from "rxjs";

import { SiteDTO } from "src/app/@types/models/SiteDTO";
import { AppModule } from "src/app/core/configs/app.module";
import { DashboardData } from "src/app/core/services/dashboard.service";
import { UiComponent } from "src/app/ui/ui.component";

@Component({
	selector: "app-dashboard",
	imports: [AppModule],
	templateUrl: "./dashboard.html",
	styleUrl: "./dashboard.scss",
})
export class Dashboard extends UiComponent implements OnInit {
	data = signal<DashboardData | null>(null);
	sites = signal<SiteDTO[]>([]);

	userSiteId: number | string | null = null;
	userSiteName: string | null = null;

	form: FormGroup = this.fb.group({
		siteName: ["All Sites"],
		startDate: [null],
		endDate: [null],
	});

	ngOnInit(): void {
		this.userSiteId = this.authService.user()?.siteId ?? null;
		this.userSiteName = this.authService.user()?.site ?? null;
		const today = new Date();

		this.form.patchValue({
			startDate: new Date(today.getFullYear(), today.getMonth(), 1),
			endDate: new Date(today.getFullYear(), today.getMonth() + 1, 0),
			siteName: this.userSiteName ? this.userSiteName : "All Sites",
		});

		if (!this.userSiteId) {
			this.loadSites();
		}

		this.loadDashboard();

		this.form.valueChanges.pipe(debounceTime(300)).subscribe(() => {
			this.onSearch();
		});
	}

	loadSites(): void {
		this.siteService.getAll("status=1").subscribe((res) => {
			this.sites.set(res.rows as SiteDTO[]);
		});
	}

	loadDashboard(): void {
		const { siteName, startDate, endDate } = this.form.getRawValue();
		let query = "";
		if (siteName && siteName !== "All Sites") query += `siteName=${siteName}&` as string;
		if (startDate) query += `startDate=${startDate}&` as string;
		if (endDate) query += `endDate=${endDate}` as string;

		this.dashboard.getAll(query).subscribe((res) => {
			this.data.set(res);
		});
	}

	onSearch(): void {
		const { startDate, endDate } = this.form.getRawValue();

		if (startDate && endDate && startDate > endDate) {
			this.toastr.warning("Start Date cannot be greater than End Date");
			return;
		}

		this.loadDashboard();
	}

	onReset(): void {
		this.form.reset({
			siteId: null,
			startDate: null,
			endDate: null,
		});

		this.loadDashboard();
	}
}
