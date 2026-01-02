import { HttpClient } from "@angular/common/http";
import { Component, inject } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";

import { API_URL } from "src/app/app";
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
	private roleService = inject(RoleService);
	private readonly http = inject(HttpClient);
	private readonly toastr = inject(ToastrService);
	private readonly apiUrl = inject(API_URL);
	private readonly fb = inject(FormBuilder);
	private readonly dialog = inject(MatDialog);

	/** Table Inputs */
	roleApiUrl = "role"; // relative path
	displayedColumns = [
		{ label: "ID", accessor: "id" as const },
		{ label: "Role Name", accessor: "name" as const },
		{ label: "Description", accessor: "description" as const },
		{ label: "Created At", accessor: "createdAt" as const, date: true },
	];

	actionButtons = [
		{ icon: "visibility", type: "view", tooltip: "View Details" },
		{ icon: "edit", type: "edit", tooltip: "Edit Role" },
		{ icon: "delete", type: "delete", tooltip: "Delete Role" },
	];

	/** Table filters */
	filterFields: Partial<Record<keyof RoleDTO, string | number | boolean>> = {
		status: 1,
		name: "",
	};

	/** Store selected rows here */
	selected: RoleDTO[] = [];

	searchForm!: FormGroup;
	constructor() {
		this.searchForm = this.fb.group({
			name: [""],
		});
	}

	onSearch(): void {
		const nameValue = this.searchForm.get("name")?.value?.trim() || "";
		this.filterFields = { ...this.filterFields, name: nameValue };
		console.log(this.filterFields);
	}

	onClear(): void {
		this.searchForm.reset();
		this.filterFields = {};
		this.selected = [];
	}

	onAction(event: { type: string; data: RoleDTO }): void {
		switch (event.type) {
			case "edit":
				this.handleAction("update", event.data);
				break;
			case "delete":
				this.handleAction("delete", event.data);
				break;
		}
	}

	/** Handle pagination */
	onPageChange(pageIndex: number): void {
		console.log("Page changed to", pageIndex);
	}

	/** ✅ Handle selection */
	onSelectedRows(rows: RoleDTO[]): void {
		this.selected = rows; // ✅ Save the emitted rows
		console.log("Selected rows:", rows);
	}

	/** API call for delete */
	private deleteRole(id: number): void {
		const url = `${this.apiUrl}/roles/${id}`;
		this.http.delete(url).subscribe({
			next: () => {
				this.toastr.success("Role deleted successfully");
			},
			error: () => {
				this.toastr.error("Error deleting role");
			},
		});
	}

	/** ✅ Log selected rows when button is clicked */
	logSelection(): void {
		if (this.selected.length === 0) {
			this.toastr.warning("No rows selected");
			return;
		}
		console.log("Selected Roles:", this.selected);
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
			case "view":
				this.toastr.info(`Viewing role: ${data?.name}`);
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
				}
			});
	}

	onDeleteRestore(type: "delete" | "restore", data: RoleDTO): void {
		if (type === "delete") {
			this.roleService.delete(data.id).subscribe(() => {
				this.toastr.success("Role deleted successfully");
			});
		}
		if (type === "restore") {
			this.roleService.delete(data.id).subscribe(() => {
				this.toastr.success("Role deleted successfully");
			});
		}
	}
}
