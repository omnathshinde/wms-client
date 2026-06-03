import { Component } from "@angular/core";
import { FormGroup } from "@angular/forms";

import { SiteDTO } from "src/app/@types/models/SiteDTO";
import { AppComponent } from "src/app/core/configs/app.component";
import { AppModule } from "src/app/core/configs/app.module";
import { UiComponent } from "src/app/ui/ui.component";

import { SiteDialog } from "./site-dialog/site-dialog";

@Component({
	selector: "app-site",
	imports: [AppModule, AppComponent],
	templateUrl: "./site.html",
	styleUrl: "./site.scss",
})
export class Site extends UiComponent {
	pageTitle = "Site Details";
	pageHeader = [{ label: "Masters" }, { label: "Site Details", route: "/masters/user" }];

	apiUrl = "site/search/records";
	displayedColumns = [
		{ label: "Site Name", accessor: "name" as const },
		{ label: "Created At", accessor: "createdAt" as const, date: true },
		{ label: "Created By", accessor: "createdBy" as const },
	];

	get actionButtons() {
		if (this.searchForm.get("status")?.value) {
			return [{ icon: "settings_backup_restore", type: "restore", tooltip: "Reactivate Site" }];
		}
		return [
			{ icon: "edit", type: "edit", tooltip: "Edit Site" },
			{
				icon: "delete",
				type: "delete",
				tooltip: "Delete Site",
				color: "warn",
			},
		];
	}

	filterFields: Partial<Record<keyof SiteDTO, string | number | boolean>> = {
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

	onAction(event: { type: string; data: SiteDTO }): void {
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

	handleAction(action: string, data?: SiteDTO): void {
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

	onCreateUpdate(action: string, data?: SiteDTO): void {
		this.matDialog
			.open(SiteDialog, {
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

	onDeleteRestore(type: "delete" | "restore", data: SiteDTO): void {
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
