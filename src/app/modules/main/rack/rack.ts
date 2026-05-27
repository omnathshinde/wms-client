import { Component } from "@angular/core";
import { FormGroup } from "@angular/forms";
import Swal from "sweetalert2";

import { AppComponent } from "@app/core/configs/app.component";
import { AppModule } from "@app/core/configs/app.module";
import { RackDTO } from "@app/interfaces/models/RackDTO";
import { UiComponent } from "@app/ui/ui.component";

import { RackDialog } from "./rack-dialog/rack-dialog";

@Component({
	selector: "app-rack",
	imports: [AppModule, AppComponent],
	templateUrl: "./rack.html",
	styleUrl: "./rack.scss",
})
export class Rack extends UiComponent {
	pageTitle = "Rack Details";
	pageHeader = [{ label: "Masters" }, { label: "Rack Details", route: "/masters/user" }];

	apiUrl = "rack/search/records";
	displayedColumns = [
		{ label: "Rack", accessor: "name" as const },
		{ label: "Zone", accessor: (row: RackDTO) => row.zone?.name ?? "-" },
		{ label: "Site", accessor: (row: RackDTO) => row.zone?.site?.name ?? "-" },
		{ label: "Created At", accessor: "createdAt" as const, date: true },
		{ label: "Created By", accessor: "createdBy" as const },
	];

	get actionButtons() {
		if (this.searchForm.get("status")?.value) {
			return [{ icon: "settings_backup_restore", type: "restore", tooltip: "Reactivate Rack" }];
		}
		return [
			{ icon: "edit", type: "edit", tooltip: "Edit Rack" },
			{
				icon: "delete",
				type: "delete",
				tooltip: "Delete Rack",
				color: "warn",
			},
		];
	}

	filterFields: Partial<Record<keyof RackDTO, string | number | boolean>> = {
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

	onAction(event: { type: string; data: RackDTO }): void {
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

	handleAction(action: string, data?: RackDTO): void {
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

	onCreateUpdate(action: string, data?: RackDTO): void {
		this.matDialog
			.open(RackDialog, {
				minWidth: "40%",
				data: action === "update" ? data : null,
			})
			.afterClosed()
			.subscribe((result) => {
				if (result) {
					this.onSearch();
				}
			});
	}

	onDeleteRestore(type: "delete" | "restore", data: RackDTO): void {
		const actionMap = {
			delete: {
				call: () => this.zoneService.delete(data.id),
				message: "Rack deactivated successfully",
				confirmText: "Yes, delete it",
				title: "Deactivate Rack?",
				text: "Are you sure you want to deactivate this rack?",
				icon: "warning" as const,
			},
			restore: {
				call: () => this.zoneService.restore(data.id),
				message: "Zone restored successfully",
				confirmText: "Yes, restore it",
				title: "Reactivate Rack?",
				text: "Are you sure you want to reactivate this rack?",
				icon: "question" as const,
			},
		};

		const action = actionMap[type];
		if (!action) return;

		Swal.fire({
			title: action.title,
			text: action.text,
			icon: action.icon,
			showCancelButton: true,
			confirmButtonText: action.confirmText,
			cancelButtonText: "Cancel",
		}).then((result) => {
			if (!result.isConfirmed) return;
			action.call().subscribe(() => {
				this.onSearch();
			});
		});
	}
}
