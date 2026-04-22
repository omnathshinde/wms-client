import { Component } from "@angular/core";
import { FormGroup } from "@angular/forms";

import { AppComponent } from "src/app/core/configs/app.component";
import { AppModule } from "src/app/core/configs/app.module";
import { UserDTO } from "src/app/interfaces/models/UserDTO";
import { UiComponent } from "src/app/ui/ui.component";

import { UserDialog } from "./user-dialog/user-dialog";

@Component({
	selector: "app-user",
	imports: [AppModule, AppComponent],
	templateUrl: "./user.html",
	styleUrl: "./user.scss",
})
export class User extends UiComponent {
	pageTitle = "User Details";
	pageHeader = [{ label: "Masters" }, { label: "User Details", route: "/masters/user" }];

	userApiUrl = "user/search/records";
	displayedColumns = [
		{ label: "Employee Name", accessor: "name" as const },
		{ label: "Employee ID", accessor: "employeeId" as const },
		{ label: "Username", accessor: "username" as const },
		{
			accessor: (row: UserDTO) => row.role?.name,
			label: "Role",
		},
		{ label: "Updated At", accessor: "updatedAt" as const, date: true },
		{ label: "Updated By", accessor: "updatedBy" as const },
	];

	get actionButtons() {
		if (this.searchForm.get("status")?.value) {
			return [{ icon: "settings_backup_restore", type: "restore", tooltip: "Reactivate User" }];
		}
		return [
			{ icon: "edit", type: "edit", tooltip: "Edit User" },
			{
				icon: "delete",
				type: "delete",
				tooltip: "Delete User",
				color: "warn",
				disabled: (row: UserDTO) => row?.username === "admin",
			},
		];
	}

	filterFields: Partial<Record<keyof UserDTO, string | number | boolean>> = {
		status: 1,
		name: "",
	};

	searchForm: FormGroup = this.fb.group({
		username: [""],
		name: [""],
		status: [0],
	});

	onSearch(): void {
		const formValue = this.searchForm.value;

		this.filterFields = {
			username: formValue.username?.trim() || "",
			name: formValue.name?.trim() || "",
			status: formValue.status ? 0 : 1,
		};
	}

	onImport(): void {
		this.toastr.warning("Import functionality coming soon!");
	}

	onExport(): void {
		this.toastr.warning("Export functionality coming soon!");
	}

	onReset(): void {
		this.searchForm.reset({
			name: "",
			status: 1,
		});

		this.filterFields = { status: 1, name: "" };
	}

	onAction(event: { type: string; data: UserDTO }): void {
		switch (event.type) {
			case "edit":
				this.handleAction("update", event.data);
				break;
			case "delete":
				this.handleAction("delete", event.data);
				break;
			case "restore":
				this.handleAction("restore", event.data);
				break;
			default:
				this.toastr.error("Unknown action");
		}
	}

	handleAction(action: string, data?: UserDTO): void {
		switch (action) {
			case "create":
			case "update":
				this.onCreateUpdate(action, data);
				break;
			case "delete":
			case "restore":
				this.onDeleteRestore(action, data!);
				break;
			default:
				this.toastr.error("Unknown action");
		}
	}

	onCreateUpdate(action: string, data?: UserDTO): void {
		this.matDialog
			.open(UserDialog, {
				minWidth: "60%",
				data: action === "update" ? data : null,
			})
			.afterClosed()
			.subscribe((result) => {
				if (result) {
					this.toastr.success(`User ${action === "create" ? "created" : "updated"} successfully`);
					this.onSearch();
				}
			});
	}

	onDeleteRestore(type: "delete" | "restore", data: UserDTO): void {
		const actionMap = {
			delete: {
				call: () => this.userService.delete(data.id),
				message: "User deactivated successfully",
			},
			restore: {
				call: () => this.userService.restore(data.id),
				message: "User restored successfully",
			},
		};
		const action = actionMap[type];
		if (!action) return;
		action.call().subscribe(() => {
			this.toastr.success(action.message);
			this.onSearch();
		});
	}
}
