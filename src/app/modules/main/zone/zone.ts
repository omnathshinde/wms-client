import { Component } from "@angular/core";
import { FormGroup } from "@angular/forms";
import Swal from "sweetalert2";

import { ZoneDTO } from "src/app/@types/models/ZoneDTO";
import { AppComponent } from "src/app/core/configs/app.component";
import { AppModule } from "src/app/core/configs/app.module";
import { UiComponent } from "src/app/ui/ui.component";

import { ZoneDialog } from "./zone-dialog/zone-dialog";

@Component({
	selector: "app-zone",
	imports: [AppModule, AppComponent],
	templateUrl: "./zone.html",
	styleUrl: "./zone.scss",
})
export class Zone extends UiComponent {
	pageTitle = "Zone Details";
	pageHeader = [{ label: "Masters" }, { label: "Zone Details", route: "/masters/user" }];

	apiUrl = "zone/search/records";
	displayedColumns = [
		{ label: "Zone", accessor: "name" as const },
		{ label: "Site", accessor: (row: ZoneDTO) => row.site?.name ?? "-" },
		{ label: "Created At", accessor: "createdAt" as const, date: true },
		{ label: "Created By", accessor: "createdBy" as const },
	];

	get actionButtons() {
		if (this.searchForm.get("status")?.value) {
			return [{ icon: "settings_backup_restore", type: "restore", tooltip: "Reactivate Zone" }];
		}
		return [
			{ icon: "edit", type: "edit", tooltip: "Edit Zone" },
			{
				icon: "delete",
				type: "delete",
				tooltip: "Delete Zone",
				color: "warn",
			},
		];
	}

	filterFields: Partial<Record<keyof ZoneDTO, string | number | boolean>> = {
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

	onAction(event: { type: string; data: ZoneDTO }): void {
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

	handleAction(action: string, data?: ZoneDTO): void {
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

	onCreateUpdate(action: string, data?: ZoneDTO): void {
		this.matDialog
			.open(ZoneDialog, {
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

	onDeleteRestore(type: "delete" | "restore", data: ZoneDTO): void {
		const actionMap = {
			delete: {
				call: () => this.zoneService.delete(data.id),
				message: "Zone deactivated successfully",
				confirmText: "Yes, delete it",
				title: "Deactivate Zone?",
				text: "Are you sure you want to deactivate this zone?",
				icon: "warning" as const,
			},
			restore: {
				call: () => this.zoneService.restore(data.id),
				message: "Zone restored successfully",
				confirmText: "Yes, restore it",
				title: "Reactivate Zone?",
				text: "Are you sure you want to reactivate this zone?",
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
