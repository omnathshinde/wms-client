import { Component, inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";

import { AppModule } from "src/app/core/configs/app.module";
import { RoleService } from "src/app/modules/services/role.service";

@Component({
	selector: "app-role-dialog",
	imports: [AppModule],
	templateUrl: "./role-dialog.html",
	styleUrl: "./role-dialog.scss",
})
export class RoleDialog implements OnInit {
	form!: FormGroup;
	isEdit = false;

	private readonly fb = inject(FormBuilder);
	private readonly dialogRef = inject(MatDialogRef<RoleDialog>);
	private readonly data = inject(MAT_DIALOG_DATA);
	private readonly roleService = inject(RoleService);
	private readonly toastr = inject(ToastrService);

	ngOnInit(): void {
		this.isEdit = !!this.data;
		this.form = this.fb.group({
			name: [this.data?.name || "", [Validators.required, Validators.minLength(3)]],
		});
	}

	onSubmit(): void {
		if (this.form.invalid) return;

		const payload = { ...this.form.value };
		this.dialogRef.close(payload);

		if (this.isEdit) {
			this.roleService.update(this.data.id, payload).subscribe((res) => {
				this.toastr.success(res.message);
			});
		} else {
			this.roleService.create(payload).subscribe((res) => {
				this.toastr.success(res.message);
			});
		}
	}

	onCancel(): void {
		this.dialogRef.close();
	}
}
