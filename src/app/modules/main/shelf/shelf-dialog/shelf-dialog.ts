import { Component, inject, OnInit } from "@angular/core";
import { FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

import { RackDTO } from "src/app/@types/models/RackDTO";
import { SiteDTO } from "src/app/@types/models/SiteDTO";
import { ZoneDTO } from "src/app/@types/models/ZoneDTO";
import { AppComponent } from "src/app/core/configs/app.component";
import { AppModule } from "src/app/core/configs/app.module";
import { UiComponent } from "src/app/ui/ui.component";

@Component({
	selector: "app-shelf-dialog",
	imports: [AppModule, AppComponent],

	templateUrl: "./shelf-dialog.html",
	styleUrl: "./shelf-dialog.scss",
})
export class ShelfDialog extends UiComponent implements OnInit {
	form!: FormGroup;
	isEdit = false;

	sites: SiteDTO[] = [];
	zones: ZoneDTO[] = [];
	racks: RackDTO[] = [];

	private readonly dialog = inject(MatDialogRef<ShelfDialog>);
	private readonly data = inject(MAT_DIALOG_DATA);

	ngOnInit(): void {
		this.isEdit = !!this.data;
		const user = this.authService.getUser();
		const userSiteId = this.data?.siteId ?? user?.siteId ?? null;
		const userSiteName = this.data?.site?.name ?? user?.site ?? "";

		this.form = this.fb.group({
			siteId: [userSiteId, !userSiteId ? Validators.required : []],
			site: [userSiteName],
			zoneId: [
				{
					value: this.data?.zoneId || null,
					disabled: !user?.siteId && !this.data?.siteId,
				},
				Validators.required,
			],

			rackId: [
				{
					value: this.data?.rackId || null,
					disabled: true,
				},
				Validators.required,
			],
			name: [this.data?.name || "", [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
		});
		if (user?.siteId) {
			this.form.get("siteId")?.disable();
			this.form.get("site")?.disable();
			this.loadZones(user.siteId);

			if (this.data?.zoneId) {
				this.form.get("rackId")?.enable();

				this.loadRacks(this.data.zoneId);
			}
		} else {
			this.loadSites();
			if (this.data?.siteId) {
				this.loadZones(this.data.siteId);
				this.form.get("zoneId")?.enable();
			}
			if (this.data?.zoneId) {
				this.loadRacks(this.data.zoneId);
				this.form.get("rackId")?.enable();
			}
		}
	}

	onSiteChange(siteId: number | string): void {
		this.form.patchValue({ zoneId: null, rackId: null });
		this.zones = [];
		this.racks = [];

		this.form.get("rackId")?.disable();
		if (this.zones.length === 0) this.form.get("zoneId")?.disable();
		else this.form.get("zoneId")?.enable();
		this.loadZones(siteId);
	}

	onZoneChange(zoneId: number | string): void {
		this.form.patchValue({ rackId: null });
		this.racks = [];
		if (this.racks.length === 0) this.form.get("rackId")?.disable();
		else this.form.get("rackId")?.enable();
		this.loadRacks(zoneId);
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

	loadRacks(zoneId: number | string): void {
		this.rackService.getAll<RackDTO>(`status=1&zoneId=${zoneId}`).subscribe({
			next: (res) => {
				if (!res?.rows?.length) {
					this.toastr.warning("Rack not found");
					return;
				}
				this.racks = res.rows;
				if (this.data?.rackId) {
					this.form.patchValue({
						rackId: this.data.rackId,
					});
				}
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
			rackId:
				typeof this.form.getRawValue().rackId === "object"
					? this.form.getRawValue().rackId.id
					: this.form.getRawValue().rackId,
			name: this.form.value.name,
		};

		const request$ = this.isEdit
			? this.shelfService.update(this.data.id, payload)
			: this.shelfService.create(payload);

		request$.subscribe((res) => {
			this.toastr.success(res.message);
			this.dialog.close(true);
		});
	}

	onCancel(): void {
		this.dialog.close();
	}
}
