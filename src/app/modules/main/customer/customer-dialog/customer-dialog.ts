import { Component, inject, OnInit } from "@angular/core";
import { FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

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

	private readonly dialog = inject(MatDialogRef<CustomerDialog>);
	private readonly data = inject(MAT_DIALOG_DATA);

	ngOnInit(): void {
		this.isEdit = !!this.data;

		this.form = this.fb.group({
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

	onSubmit(): void {
		if (this.form.invalid) return;

		const payload = { ...this.form.value };

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
