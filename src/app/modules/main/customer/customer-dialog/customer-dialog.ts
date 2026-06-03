import { Component, inject, OnInit } from "@angular/core";
import { FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

import { CustomerDTO } from "src/app/@types/models/CustomerDTO";
import { AppComponent } from "src/app/core/configs/app.component";
import { AppModule } from "src/app/core/configs/app.module";
import { UiComponent } from "src/app/ui/ui.component";

@Component({
	selector: "app-customer-dialog",
	imports: [AppModule, AppComponent],
	templateUrl: "./customer-dialog.html",
	styleUrl: "./customer-dialog.scss",
})
export class CustomerDialog extends UiComponent implements OnInit {
	form!: FormGroup;
	isEdit = false;
	sites: CustomerDTO[] = [];

	private readonly dialog = inject(MatDialogRef<CustomerDialog>);
	private readonly data = inject(MAT_DIALOG_DATA);

	ngOnInit(): void {
		this.loadSites();
		this.isEdit = !!this.data;
		const user = this.authService.getUser();
		const userSiteId = this.data?.siteId ?? user?.siteId ?? null;

		this.form = this.fb.group({
			siteId: [{ value: userSiteId, disabled: !!user?.siteId }, Validators.required],
			name: [
				this.data?.name || "",
				[
					Validators.required,
					Validators.minLength(3),
					Validators.maxLength(50),
					Validators.pattern(/^[a-zA-Z ]+$/),
				],
			],
			description: [this.data?.description || "", [Validators.maxLength(300)]],
		});
	}

	loadSites(): void {
		this.siteService.getAll<CustomerDTO>("status=1").subscribe({
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
			? this.customerService.update(this.data.id, payload)
			: this.customerService.create(payload);

		request$.subscribe((res) => {
			this.toastr.success(res.message);
			this.dialog.close(true);
		});
	}

	onCancel(): void {
		this.dialog.close();
	}
}
