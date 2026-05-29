import { Component, inject, OnInit } from "@angular/core";
import { FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

import { AppComponent } from "src/app/core/configs/app.component";
import { AppModule } from "src/app/core/configs/app.module";
import { UiComponent } from "src/app/ui/ui.component";
import { MaterialDTO } from "@app/interfaces/models/MaterialDTO";

@Component({
	selector: "app-material-dialog",
	imports: [AppComponent, AppModule],
	templateUrl: "./material-dialog.html",
	styleUrl: "./material-dialog.scss",
})
export class MaterialDialog extends UiComponent implements OnInit {
	form!: FormGroup;
	isEdit = false;

	sites: MaterialDTO[] = [];

	private readonly dialog = inject(MatDialogRef<MaterialDialog>);
	private readonly data = inject(MAT_DIALOG_DATA);

	ngOnInit(): void {
		this.loadSites();
		this.isEdit = !!this.data;
		const user = this.authService.getUser();
		const userSiteId = this.data?.siteId ?? user?.siteId ?? null;
		this.form = this.fb.group({
			siteId: [{ value: userSiteId, disabled: !!user?.siteId }, Validators.required],
			name: [this.data?.name || "", [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
			description: [this.data?.description || "", [Validators.maxLength(300)]],
			customerName: [this.data?.customerName || "", [Validators.required, Validators.minLength(3)]],
			UOM: [this.data?.UOM || "", [Validators.maxLength(20)]],
			netWeight: [this.data?.netWeight || null],
			netVolume: [this.data?.netVolume || null],
			quantity: [this.data?.quantity ?? 0, [Validators.required, Validators.min(0)]],
		});
	}

	loadSites(): void {
		this.siteService.getAll<MaterialDTO>("status=1").subscribe({
			next: (res) => {
				this.sites = res.rows;
			},
		});
	}

	onSubmit(): void {
		if (this.form.invalid) return;

		const payload = {
			...this.form.getRawValue(),
			siteId:
				typeof this.form.getRawValue().siteId === "object"
					? this.form.getRawValue().siteId.id
					: this.form.getRawValue().siteId,
		};
		const request$ = this.isEdit
			? this.materialService.update(this.data.id, payload)
			: this.materialService.create(payload);

		request$.subscribe((res) => {
			this.toastr.success(res.message);
			this.dialog.close(true);
		});
	}

	onCancel(): void {
		this.dialog.close();
	}
}
