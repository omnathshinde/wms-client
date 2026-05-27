import { Component, inject, OnInit } from "@angular/core";
import { FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

import { AppComponent } from "@app/core/configs/app.component";
import { AppModule } from "@app/core/configs/app.module";
import { SiteDTO } from "@app/interfaces/models/SiteDTO";
import { ZoneDTO } from "@app/interfaces/models/ZoneDTO";
import { UiComponent } from "@app/ui/ui.component";

@Component({
	selector: "app-zone-dialog",
	imports: [AppModule, AppComponent],
	templateUrl: "./zone-dialog.html",
	styleUrl: "./zone-dialog.scss",
})
export class ZoneDialog extends UiComponent implements OnInit {
	form!: FormGroup;
	isEdit = false;

	sites: SiteDTO[] = [];

	private readonly dialog = inject(MatDialogRef<ZoneDialog>);
	private readonly data = inject<ZoneDTO>(MAT_DIALOG_DATA);

	ngOnInit(): void {
		this.isEdit = !!this.data;
		const user = this.authService.getUser();
		const userSiteId = this.data?.siteId ?? user?.siteId ?? null;
		const userSiteName = this.data?.site?.name ?? user?.site ?? "";

		this.form = this.fb.group({
			siteId: [userSiteId, !userSiteId ? Validators.required : []],
			site: [userSiteName],
			name: [this.data?.name || "", [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
		});
		if (user?.siteId) {
			this.form.get("siteId")?.disable();
			this.form.get("site")?.disable();
		} else {
			this.loadSites();
		}
	}

	loadSites(): void {
		this.siteService.getAll<SiteDTO>("status=1").subscribe({
			next: (res) => {
				this.sites = res.rows;
				if (!res?.rows?.length) {
					this.toastr.warning("Site not found");
					return;
				}
				if (this.data?.siteId) {
					this.form.patchValue({
						siteId: this.data.siteId,
					});
				}
			},
		});
	}

	onSubmit(): void {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

		const payload = {
			siteId:
				typeof this.form.getRawValue().siteId === "object"
					? this.form.getRawValue().siteId.id
					: this.form.getRawValue().siteId,
			name: this.form.value.name,
		};

		const request$ = this.isEdit
			? this.zoneService.update(this.data.id, payload)
			: this.zoneService.create(payload);

		request$.subscribe((res) => {
			this.toastr.success(res.message);
			this.dialog.close(true);
		});
	}

	onCancel(): void {
		this.dialog.close();
	}
}
