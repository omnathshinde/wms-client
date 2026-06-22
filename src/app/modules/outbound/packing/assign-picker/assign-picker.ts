import { Component, inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

import { UserDTO } from "src/app/@types/models/UserDTO";
import { AppComponent } from "src/app/core/configs/app.component";
import { AppModule } from "src/app/core/configs/app.module";
import { UiComponent } from "src/app/ui/ui.component";

interface AssignPickerDialogData {
	id: number;
	name: string;
	userId?: number | null;
	userName?: string | null;
}

@Component({
	selector: "app-assign-picker",
	imports: [AppComponent, AppModule],
	templateUrl: "./assign-picker.html",
	styleUrl: "./assign-picker.scss",
})
export class AssignPicker extends UiComponent implements OnInit {
	form!: FormGroup;

	users: UserDTO[] = [];

	userSearchControl = new FormControl<string | UserDTO>("", {
		nonNullable: true,
	});

	private readonly dialogRef = inject(MatDialogRef<AssignPicker>);

	public readonly data = inject<AssignPickerDialogData>(MAT_DIALOG_DATA);

	ngOnInit(): void {
		this.form = this.fb.group({
			newPickerId: [null, Validators.required],
		});

		this.userSearchControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe((value) => {
			if (typeof value !== "string") {
				return;
			}
			const search = value.trim();
			if (search.length < 2) {
				this.users = [];
				return;
			}
			this.searchUsers(search);
		});
	}

	searchUsers(search: string): void {
		const query = `?status=1&name=${encodeURIComponent(search)}`;
		this.userService.search<UserDTO>(query).subscribe({
			next: (res) => {
				this.users = res.rows.filter((user) => user.id !== this.data.userId);
			},
			error: () => {
				this.users = [];
			},
		});
	}

	selectUser(user: UserDTO): void {
		this.form.patchValue({
			newPickerId: user.id,
		});

		this.userSearchControl.setValue(user, {
			emitEvent: false,
		});
	}

	displayUser = (user: UserDTO | string | null): string => {
		if (!user) return "";

		if (typeof user === "string") {
			return user;
		}

		return user.name;
	};

	onSubmit(): void {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

		this.dialogRef.close({
			picklistId: this.data.id,
			currentPickerId: this.form.value.newPickerId,
			previousPickerId: this.data.userId ?? null,
		});
	}

	onCancel(): void {
		this.dialogRef.close();
	}
}
