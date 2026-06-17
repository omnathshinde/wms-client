import { Component, inject, OnInit } from "@angular/core";
import { FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

import { AppComponent } from "src/app/core/configs/app.component";
import { AppModule } from "src/app/core/configs/app.module";
import { UiComponent } from "src/app/ui/ui.component";

@Component({
	selector: "app-qc-dialog",
	imports: [AppModule, AppComponent],
	templateUrl: "./qc-dialog.html",
	styleUrl: "./qc-dialog.scss",
})
export class QcDialog extends UiComponent implements OnInit {
	form!: FormGroup;

	private readonly dialogRef = inject(MatDialogRef<QcDialog>);
	public readonly data = inject(MAT_DIALOG_DATA);

	ngOnInit(): void {
		this.form = this.fb.group({
			remark: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
		});
	}

	onSubmit(): void {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

		this.dialogRef.close(this.form.value.remark);
	}

	onCancel(): void {
		this.dialogRef.close();
	}
}
