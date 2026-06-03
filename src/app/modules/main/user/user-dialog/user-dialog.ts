import { Component, inject, OnInit, signal } from "@angular/core";
import { FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { forkJoin } from "rxjs";

import { RoleDTO } from "src/app/@types/models/RoleDTO";
import { SiteDTO } from "src/app/@types/models/SiteDTO";
import { AppModule } from "src/app/core/configs/app.module";
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
	sites: SiteDTO[] = [];
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
			siteId: [this.data?.siteId || "", [Validators.required]],
		});

		forkJoin({
			roles: this.roleService.getAll<RoleDTO>("status=1"),
			sites: this.siteService.getAll<SiteDTO>("status=1"),
		}).subscribe(({ roles, sites }) => {
			this.roles = roles.rows;
			this.sites = sites.rows;
			this.handleAdminLock();
		});
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
