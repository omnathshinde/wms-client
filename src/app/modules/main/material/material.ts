import { Component } from "@angular/core";
import { FormGroup } from "@angular/forms";

import { AppComponent } from "src/app/core/configs/app.component";
import { AppModule } from "src/app/core/configs/app.module";
import { MaterialDTO } from "src/app/interfaces/models/MaterialDTO";
import { UiComponent } from "src/app/ui/ui.component";

import { MaterialDialog } from "./material-dialog/material-dialog";

@Component({
	selector: "app-material",
	imports: [AppComponent, AppModule],
	templateUrl: "./material.html",
	styleUrl: "./material.scss",
})
export class Material extends UiComponent {
	pageTitle = "Material Details";
	apiUrl = "material/search/records";
	displayedColumns = [
		{ label: "Name", accessor: "name" as const },
		{ label: "Description", accessor: "description" as const },
		{ label: "Vendor", accessor: "customerName" as const },
		{ label: "Net Wt.", accessor: "netWeight" as const },
		{ label: "Net Vo.", accessor: "netVolume" as const },
		{ label: "Site", accessor: (row: MaterialDTO) => row.site?.name ?? "-" },
		{ label: "Created At", accessor: "createdAt" as const, date: true },
		{ label: "Created By", accessor: "createdBy" as const },
	];

	get actionButtons() {
		if (this.searchForm.get("status")?.value) {
			return [{ icon: "settings_backup_restore", type: "restore", tooltip: "Reactivate Material" }];
		}
		return [
			{ icon: "edit", type: "edit", tooltip: "Edit Material" },
			{
				icon: "delete",
				type: "delete",
				tooltip: "Delete Material",
				color: "warn",
			},
		];
	}

	filterFields: Partial<Record<keyof MaterialDTO, string | number | boolean>> = {
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
			status: formValue.status ? 0 : 1,
			name: formValue.name || "",
		};
	}

	onReset(): void {
		this.searchForm.reset({
			name: "",
			status: 1,
		});

		this.filterFields = { status: 1, name: "" };
	}

	onImport(): void {
		this.toastr.warning("Import functionality coming soon!");
	}

	onExport(): void {
		this.toastr.warning("Export functionality coming soon!");
	}

	onAction(event: { type: string; data: MaterialDTO }): void {
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

	handleAction(action: string, data?: MaterialDTO): void {
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

	onCreateUpdate(action: string, data?: MaterialDTO): void {
		this.matDialog
			.open(MaterialDialog, {
				minWidth: "60%",
				data: action === "update" ? data : null,
			})
			.afterClosed()
			.subscribe((result) => {
				if (result) {
					this.onSearch();
				}
			});
	}

	onDeleteRestore(type: "delete" | "restore", data: MaterialDTO): void {
		const actionMap = {
			delete: {
				call: () => this.siteService.delete(data.id),
				message: "Site deactivated successfully",
			},
			restore: {
				call: () => this.siteService.restore(data.id),
				message: "Site restored successfully",
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
