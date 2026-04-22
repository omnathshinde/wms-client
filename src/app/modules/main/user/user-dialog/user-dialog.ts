import { Component, inject, OnInit, signal } from "@angular/core";
import { FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

import { AppModule } from "src/app/core/configs/app.module";
import { ApiResponse } from "src/app/interfaces/common/ApiResponse";
import { RoleDTO } from "src/app/interfaces/models/RoleDTO";
import { UiComponent } from "src/app/ui/ui.component";

@Component({
	selector: "app-user-dialog",
	imports: [AppModule],
	templateUrl: "./user-dialog.html",
	styleUrl: "./user-dialog.scss",
})
export class UserDialog extends UiComponent implements OnInit {
	form!: FormGroup;
	isEdit = false;
	roles: RoleDTO[] = [];
	hidePassword = signal(true);

	private readonly dialog = inject(MatDialogRef<UserDialog>);
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
			employeeId: [
				this.data?.employeeId || "",
				[Validators.required, Validators.minLength(1), Validators.pattern(/^[a-zA-Z0-9_]+$/)],
			],
			username: [
				this.data?.username || "",
				[Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9_]+$/)],
			],
			password: [
				"",
				this.isEdit
					? []
					: [
							Validators.required,
							Validators.minLength(6),
							Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/),
						],
			],
			roleId: [this.data?.roleId || "", [Validators.required]],
		});
		this.roleService.getAll<RoleDTO>("status=1").subscribe((res: ApiResponse<RoleDTO>) => {
			this.roles = res.rows;
		});
		this.handleAdminLock();
	}

	handleAdminLock(): void {
		if (this.data?.username === "admin" && this.data?.employeeId === "1") {
			this.form.get("username")?.disable();
			this.form.get("employeeId")?.disable();
			this.form.get("name")?.disable();
			this.form.get("roleId")?.disable();
		}
	}

	togglePasswordVisibility() {
		this.hidePassword.update((v) => !v);
	}

	onSubmit(): void {
		if (this.form.invalid) return;

		const payload = { ...this.form.value };
		this.dialog.close(payload);

		if (this.isEdit) {
			this.userService.update(this.data.id, payload).subscribe((res) => {
				this.toastr.success(res.message);
			});
		} else {
			this.userService.create(payload).subscribe((res) => {
				this.toastr.success(res.message);
			});
		}
	}

	onCancel(): void {
		this.dialog.close();
	}
}
