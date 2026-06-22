import { Component, OnInit, signal } from "@angular/core";
import { FormGroup, Validators } from "@angular/forms";

import { PicklistDTO } from "src/app/@types/models/PicklistDTO";
import { SiteDTO } from "src/app/@types/models/SiteDTO";
import { AppComponent } from "src/app/core/configs/app.component";
import { AppModule } from "src/app/core/configs/app.module";
import { UiComponent } from "src/app/ui/ui.component";

@Component({
	selector: "app-dispatch",
	imports: [AppComponent, AppModule],
	templateUrl: "./dispatch.html",
	styleUrl: "./dispatch.scss",
})
export class Dispatch extends UiComponent implements OnInit {
	form!: FormGroup;
	sites = signal<SiteDTO[]>([]);
	picklists = signal<PicklistDTO[]>([]);

	userSiteId = this.authService.user()?.siteId ?? null;
	userSiteName = this.authService.user()?.site ?? "";

	noPicklists = false;

	apiUrl = "picklist";
	displayedColumns = [
		{ label: "Name", accessor: "name" as const },
		{ label: "Customer", accessor: (row: PicklistDTO) => row.customer?.name ?? "-" },
		{ label: "Status", accessor: "picklistStatus" as const },
		{ label: "Picker", accessor: (row: PicklistDTO) => row.user?.name ?? "-" },
		{ label: "Dispatch At", accessor: "issueDate" as const, date: true },
		{ label: "Dispatch By", accessor: "issueBy" as const },
	];
	filterFields: Partial<Record<keyof PicklistDTO, string | number | boolean>> = {
		status: 1,
		isIssued: 1,
		picklistStatus: "Completed",
	};
	ngOnInit(): void {
		this.form = this.fb.group({
			siteId: [this.userSiteId, Validators.required],
			picklistId: [null, Validators.required],
			vehicleNo: ["", [Validators.required, Validators.minLength(3)]],
		});

		if (this.userSiteId) {
			this.form.patchValue({
				siteId: this.userSiteId,
			});
			this.sites.update((sites) => [
				...sites,
				{
					id: this.userSiteId,
					name: this.userSiteName,
				} as SiteDTO,
			]);
			this.form.get("siteId")?.disable();
			this.loadPicklists(this.userSiteId);
		} else {
			this.loadSites();
		}

		this.form.get("siteId")?.valueChanges.subscribe((siteId) => {
			this.form.patchValue({
				picklistId: null,
			});

			this.picklists.set([]);

			if (!siteId) {
				return;
			}

			this.loadPicklists(siteId);
		});
	}

	loadSites(): void {
		this.siteService.getAll("?status=1").subscribe({
			next: (res) => {
				this.sites.set(res.rows as SiteDTO[]);
				if (this.userSiteId) {
					this.form.patchValue({
						siteId: this.userSiteId,
					});

					this.form.get("siteId")?.disable();
				}
			},
		});
	}

	loadPicklists(siteId: number | string): void {
		this.picklistService
			.search<PicklistDTO>(`?siteId=${siteId}&picklistStatus=Completed&isIssued=false`)
			.subscribe({
				next: (res) => {
					const rows = res.rows ?? [];
					this.noPicklists = rows.length === 0;
					if (this.noPicklists) {
						this.form.patchValue({
							picklistId: null,
						});
					}
					this.picklists.set(rows);
					if (!rows.length) {
						this.toastr.warning("No completed picklists available for dispatch");
					}
				},
			});
	}

	onDispatch(): void {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

		const { picklistId, vehicleNo } = this.form.getRawValue();

		this.picklistService
			.update(picklistId as string, {
				isIssued: true,
				vehicleNo,
			})
			.subscribe((res) => {
				this.toastr.success(res.message);
				this.onReset();
			});
	}

	onReset(): void {
		this.form.reset({
			siteId: this.userSiteId,
			picklistId: null,
			vehicleNo: "",
		});

		if (this.userSiteId) {
			this.loadPicklists(this.userSiteId);
		}
	}
}
