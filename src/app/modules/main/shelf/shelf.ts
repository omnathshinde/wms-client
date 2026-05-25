import { Component } from "@angular/core";
import { FormGroup } from "@angular/forms";
import Swal from "sweetalert2";

import { AppComponent } from "@app/core/configs/app.component";
import { AppModule } from "@app/core/configs/app.module";
import { ShelfDTO } from "@app/interfaces/models/ShelfDTO";
import { UiComponent } from "@app/ui/ui.component";

import { ShelfDialog } from "./shelf-dialog/shelf-dialog";

@Component({
	selector: "app-shelf",
	imports: [AppModule, AppComponent],
	templateUrl: "./shelf.html",
	styleUrl: "./shelf.scss",
})
export class Shelf extends UiComponent {
	pageTitle = "Shelf Details";
	pageHeader = [{ label: "Masters" }, { label: "Shelf Details", route: "/masters/user" }];

	apiUrl = "shelf/search/records";
	displayedColumns = [
		{ label: "Shelf", accessor: "name" as const },
		{ label: "Rack", accessor: (row: ShelfDTO) => row.rack?.name ?? "-" },
		{ label: "Zone", accessor: (row: ShelfDTO) => row.rack?.zone?.name ?? "-" },
		{ label: "Site", accessor: (row: ShelfDTO) => row.rack?.zone?.site?.name ?? "-" },
		{ label: "Created At", accessor: "createdAt" as const, date: true },
		{ label: "Created By", accessor: "createdBy" as const },
	];

	get actionButtons() {
		if (this.searchForm.get("status")?.value) {
			return [{ icon: "settings_backup_restore", type: "restore", tooltip: "Reactivate Shelf" }];
		}
		return [
			{ icon: "edit", type: "edit", tooltip: "Edit Shelf" },
			{
				icon: "delete",
				type: "delete",
				tooltip: "Delete Shelf",
				color: "warn",
			},
		];
	}

	filterFields: Partial<Record<keyof ShelfDTO, string | number | boolean>> = {
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

	onAction(event: { type: string; data: ShelfDTO }): void {
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

	handleAction(action: string, data?: ShelfDTO): void {
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

	onCreateUpdate(action: string, data?: ShelfDTO): void {
		this.matDialog
			.open(ShelfDialog, {
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

	onDeleteRestore(type: "delete" | "restore", data: ShelfDTO): void {
		const actionMap = {
			delete: {
				call: () => this.zoneService.delete(data.id),
				message: "Shelf deactivated successfully",
				confirmText: "Yes, delete it",
				title: "Deactivate Shelf?",
				text: "Are you sure you want to deactivate this shelf?",
				icon: "warning" as const,
			},
			restore: {
				call: () => this.zoneService.restore(data.id),
				message: "Shelf restored successfully",
				confirmText: "Yes, restore it",
				title: "Reactivate Shelf?",
				text: "Are you sure you want to reactivate this Shelf?",
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
