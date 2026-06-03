import { Component, inject, OnInit } from "@angular/core";
import { FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

import { SiteDTO } from "src/app/@types/models/SiteDTO";
import { ZoneDTO } from "src/app/@types/models/ZoneDTO";
import { AppComponent } from "src/app/core/configs/app.component";
import { AppModule } from "src/app/core/configs/app.module";
import { UiComponent } from "src/app/ui/ui.component";

@Component({
	selector: "app-rack-dialog",
	imports: [AppModule, AppComponent],
	templateUrl: "./rack-dialog.html",
	styleUrl: "./rack-dialog.scss",
})
export class RackDialog extends UiComponent implements OnInit {
	form!: FormGroup;
	isEdit = false;

	sites: SiteDTO[] = [];
	zones: ZoneDTO[] = [];

	private readonly dialog = inject(MatDialogRef<RackDialog>);
	private readonly data = inject(MAT_DIALOG_DATA);

	ngOnInit(): void {
		this.isEdit = !!this.data;
		const user = this.authService.getUser();
		const userSiteId = this.data?.siteId ?? user?.siteId ?? null;
		const userSiteName = this.data?.site?.name ?? user?.site ?? "";

		this.form = this.fb.group({
			siteId: [userSiteId, !userSiteId ? Validators.required : []],
			site: [userSiteName],
			zoneId: [this.data?.zoneId || null, Validators.required],
			name: [this.data?.name || "", [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
		});
		if (user?.siteId) {
			this.form.get("siteId")?.disable();
			this.form.get("site")?.disable();
			this.loadZones(user.siteId);
		} else {
			this.loadSites();
		}
	}

	onSiteChange(siteId: number | string): void {
		this.form.patchValue({ zoneId: null });
		this.zones = [];
		this.loadZones(siteId);
	}

	loadSites(): void {
		this.siteService.getAll<SiteDTO>("status=1").subscribe({
			next: (res) => {
				if (!res?.rows?.length) {
					this.toastr.warning("Site Not found");
					return;
				}
				this.sites = res.rows;
			},
		});
	}

	loadZones(siteId: number | string): void {
		this.zoneService.getAll<ZoneDTO>(`status=1&siteId=${siteId}`).subscribe({
			next: (res) => {
				if (!res?.rows?.length) {
					this.toastr.warning("Zone Not found");
					return;
				}
				this.zones = res.rows;
			},
		});
	}

	onSubmit(): void {
		if (this.form.invalid) return;

		const payload = {
			siteId:
				typeof this.form.getRawValue().siteId === "object"
					? this.form.getRawValue().siteId.id
					: this.form.getRawValue().siteId,

			zoneId:
				typeof this.form.getRawValue().zoneId === "object"
					? this.form.getRawValue().zoneId.id
					: this.form.getRawValue().zoneId,

			name: this.form.value.name,
		};

		const request$ = this.isEdit
			? this.rackService.update(this.data.id, payload)
			: this.rackService.create(payload);

		request$.subscribe((res) => {
			this.toastr.success(res.message);
			this.dialog.close(true);
		});
	}

	onCancel(): void {
		this.dialog.close();
	}
}
