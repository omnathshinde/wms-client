import { Component } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { filter } from "rxjs";
import Swal from "sweetalert2";

import { CustomerDTO } from "src/app/@types/models/CustomerDTO";
import { AppComponent } from "src/app/core/configs/app.component";
import { AppModule } from "src/app/core/configs/app.module";
import { UiComponent } from "src/app/ui/ui.component";

import { CustomerDialog } from "./customer-dialog/customer-dialog";

@Component({
	selector: "app-customer",
	imports: [AppComponent, AppModule],
	templateUrl: "./customer.html",
	styleUrl: "./customer.scss",
})
export class Customer extends UiComponent {
	pageTitle = "Customer Details";
	apiUrl = "customer/search/records";
	displayedColumns = [
		{ label: "Name", accessor: "name" as const },
		{ label: "Description", accessor: "description" as const },
		{ label: "Created At", accessor: "createdAt" as const, date: true },
		{ label: "Created By", accessor: "createdBy" as const },
	];

	get actionButtons() {
		if (this.searchForm.get("status")?.value) {
			return [{ icon: "settings_backup_restore", type: "restore", tooltip: "Reactivate Customer" }];
		}
		return [
			{ icon: "edit", type: "edit", tooltip: "Edit Customer" },
			{
				icon: "delete",
				type: "delete",
				tooltip: "Delete Customer",
				color: "warn",
			},
		];
	}

	filterFields: Partial<Record<keyof CustomerDTO, string | number | boolean>> = {
		status: 1,
		name: "",
		description: "",
	};

	searchForm: FormGroup = this.fb.group({
		name: [""],
		description: [""],
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

	onAction(event: { type: string; data: CustomerDTO }): void {
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

	handleAction(action: string, data?: CustomerDTO): void {
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

	onCreateUpdate(action: string, data?: CustomerDTO): void {
		const dialogRef = this.matDialog.open(CustomerDialog, {
			minWidth: "40%",
			data: action === "update" ? data : null,
		});

		dialogRef.afterClosed().pipe(filter(Boolean)).subscribe(this.onSearch.bind(this));
	}

	onDeleteRestore(type: "delete" | "restore", data: CustomerDTO): void {
		const actionMap = {
			delete: {
				call: () => this.customerService.delete(data.id),
				message: "Customer deactivated successfully",
				confirmText: "Yes, delete it",
				title: "Deactivate Customer?",
				text: "This action will deactivate the customer.",
				icon: "warning" as const,
			},
			restore: {
				call: () => this.customerService.restore(data.id),
				message: "Customer restored successfully",
				confirmText: "Yes, restore it",
				title: "Reactivate Customer?",
				text: "This action will reactivate the customer.",
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
