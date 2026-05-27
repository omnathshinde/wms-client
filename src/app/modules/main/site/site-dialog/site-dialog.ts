import { Component, inject, OnInit } from "@angular/core";
import { FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

import { AppComponent } from "src/app/core/configs/app.component";
import { AppModule } from "src/app/core/configs/app.module";
import { UiComponent } from "src/app/ui/ui.component";

@Component({
	selector: "app-site-dialog",
	imports: [AppModule, AppComponent],
	templateUrl: "./site-dialog.html",
	styleUrl: "./site-dialog.scss",
})
export class SiteDialog extends UiComponent implements OnInit {
	form!: FormGroup;
	isEdit = false;

	private readonly dialog = inject(MatDialogRef<SiteDialog>);
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
		});
	}

	onSubmit(): void {
		if (this.form.invalid) return;

		const payload = { ...this.form.value };

		const request$ = this.isEdit
			? this.siteService.update(this.data.id, payload)
			: this.siteService.create(payload);

		request$.subscribe((res) => {
			this.toastr.success(res.message);
			this.dialog.close(true);
		});
	}

	onCancel(): void {
		this.dialog.close();
	}
}
