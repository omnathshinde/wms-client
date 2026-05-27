import { Component, inject } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";

import { AppComponent } from "src/app/core/configs/app.component";
import { AppModule } from "src/app/core/configs/app.module";
import { RoleDTO } from "src/app/interfaces/models/RoleDTO";
import { RoleDialog } from "src/app/modules/main/role/role-dialog/role-dialog";
import { RoleService } from "src/app/modules/services/role.service";

@Component({
	selector: "app-role",
	imports: [AppModule, ...AppComponent],
	templateUrl: "./role.html",
	styleUrl: "./role.scss",
})
export class Role {
	private readonly roleService = inject(RoleService);
	private readonly toastr = inject(ToastrService);
	private readonly fb = inject(FormBuilder);
	private readonly dialog = inject(MatDialog);

	pageTitle = "Role Details";
	pageHeader = [{ label: "Masters" }, { label: "Role Details", route: "/masters/role" }];

	apiUrl = "role";
	displayedColumns = [
		{ label: "Role Name", accessor: "name" as const },
		{ label: "Created At", accessor: "createdAt" as const, date: true },
		{ label: "Created By", accessor: "createdBy" as const },
	];
	get actionButtons() {
		if (this.searchForm.get("status")?.value) {
			return [{ icon: "settings_backup_restore", type: "restore", tooltip: "Reactivate Role" }];
		}
		return [
			{
				icon: "security",
				type: "access",
				tooltip: "Manage Access",
				disabled: (row: RoleDTO) => row?.name === "admin",
			},
			{ icon: "edit", type: "edit", tooltip: "Edit Role", disabled: (row: RoleDTO) => row?.name === "admin" },
			{
				icon: "delete",
				type: "delete",
				tooltip: "Delete Role",
				color: "warn",
				disabled: (row: RoleDTO) => row?.name === "admin",
			},
		];
	}

	filterFields: Partial<Record<keyof RoleDTO, string | number | boolean>> = {
		status: 1,
		name: "",
	};

	searchForm: FormGroup = this.fb.group({
		name: [""],
		status: [0],
	});

	onSearch(): void {
		const formValue = this.searchForm.value;

		this.filterFields = {
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

	onAction(event: { type: string; data: RoleDTO }): void {
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
			case "access":
				this.toastr.warning(`Managing access functionality for role coming soon!`);
				break;
			default:
				this.toastr.error("Unknown action");
		}
	}

	handleAction(action: string, data?: RoleDTO): void {
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

	onCreateUpdate(action: string, data?: RoleDTO): void {
		this.dialog
			.open(RoleDialog, {
				width: "400px",
				data: action === "update" ? data : null,
			})
			.afterClosed()
			.subscribe((result) => {
				if (result) {
					this.toastr.success(`Role ${action === "create" ? "created" : "updated"} successfully`);
					this.onSearch();
				}
			});
	}

	onDeleteRestore(type: "delete" | "restore", data: RoleDTO): void {
		const actionMap = {
			delete: {
				call: () => this.roleService.delete(data.id),
				message: "Role deactivated successfully",
			},
			restore: {
				call: () => this.roleService.restore(data.id),
				message: "Role restored successfully",
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
