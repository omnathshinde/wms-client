import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import Swal from "sweetalert2";

import { PicklistDTO } from "src/app/@types/models/PicklistDTO";
import { AppComponent } from "src/app/core/configs/app.component";
import { AppModule } from "src/app/core/configs/app.module";
import { UiComponent } from "src/app/ui/ui.component";

import { AssignPicker } from "./assign-picker/assign-picker";

@Component({
	selector: "app-packing",
	imports: [AppComponent, AppModule],
	templateUrl: "./packing.html",
	styleUrl: "./packing.scss",
})
export class Packing extends UiComponent implements OnInit {
	apiUrl = "picklist/search/records";
	rowColor = (row: PicklistDTO): string => {
		switch (row.picklistStatus) {
			case "Completed":
				return "#e8f5e9";
			case "In Progress":
				return "#fff8e1";
			case "Pending":
				return "";
			default:
				return "";
		}
	};

	displayedColumns = [
		{ label: "Name", accessor: "name" as const },
		{ label: "Status", accessor: "picklistStatus" as const },
		{ label: "Picker", accessor: (row: PicklistDTO) => row.user?.name ?? "-" },
		{ label: "Created At", accessor: "createdAt" as const, date: true },
		{ label: "Created By", accessor: "createdBy" as const },
	];

	actionButtons = [
		{
			type: "assign",
			icon: "assignment_ind",
			tooltip: "Assign Picker",
			color: "primary",
			visible: (row: PicklistDTO) => row.picklistStatus === "Pending" || row.picklistStatus === "In Progress",
		},
		{
			type: "pending",
			icon: "play_circle_filled",
			tooltip: "Start Picklist",
			color: "primary",
			visible: (row: PicklistDTO) => row.picklistStatus === "Pending",
		},
		{
			type: "start",
			icon: "arrow_forward",
			tooltip: "Start Picking",
			color: "primary",
			visible: (row: PicklistDTO) => row.picklistStatus === "In Progress",
		},
		{
			type: "view",
			icon: "remove_red_eye",
			tooltip: "Start Picking",
			color: "primary",
			visible: (row: PicklistDTO) => row.picklistStatus === "Pending" || row.picklistStatus === "Completed",
		},
		{
			type: "delete",
			icon: "delete",
			tooltip: "Delete Picklist",
			color: "warn",
			visible: (row: PicklistDTO) => row.picklistStatus === "Pending" || row.picklistStatus === "In Progress",
		},
	];

	filterFields: Partial<Record<keyof PicklistDTO, string | number | boolean>> = {
		status: 1,
		name: "",
		picklistStatus: "",
	};

	searchForm: FormGroup = this.fb.group({
		name: [""],
		picklistStatus: [""],
	});

	ngOnInit(): void {
		this.searchForm.valueChanges.subscribe(() => {
			this.onSearch();
		});
	}

	onSearch(): void {
		const formValue = this.searchForm.value;

		this.filterFields = {
			status: 1,
			name: formValue.name || "",
			picklistStatus: formValue.picklistStatus || "",
		};
	}

	onReset(): void {
		this.searchForm.reset({
			barcode: "",
			qcStatus: "",
		});

		this.filterFields = {
			status: 1,
			name: "",
			picklistStatus: "",
		};
	}

	onAction(event: { type: string; data: PicklistDTO }): void {
		switch (event.type) {
			case "assign":
				this.onAssignPicker(event.data);
				break;
			case "pending":
				this.onStart(event.data, event.type);
				break;
			case "start":
			case "view":
				this.onStart(event.data, event.type);
				break;
			case "delete":
				this.onDelete(event.data);
				break;
			default:
				this.toastr.error("Unknown action");
		}
	}

	onAssignPicker(data: PicklistDTO): void {
		this.matDialog
			.open(AssignPicker, {
				minWidth: "40%",
				data,
			})
			.afterClosed()
			.subscribe((payload) => {
				if (!payload) return;

				this.picklistPickerService.create(payload).subscribe((res) => {
					this.toastr.success(res.message);
					this.onSearch();
				});
			});
	}

	onStart(data: PicklistDTO, type: string): void {
		if (data.picklistStatus === "Pending" && type === "pending") {
			this.picklistService
				.update(data.id, {
					picklistStatus: "In Progress",
				})
				.subscribe({
					next: (res) => {
						this.toastr.success(res.message);
						this.onSearch();
					},
				});

			return;
		}
		if (data.picklistStatus === "In Progress") {
			this.router.navigate(["/outbound/packing", data.id], {
				queryParams: {
					status: data.picklistStatus,
				},
			});
		}

		if (data.picklistStatus === "Completed" || (data.picklistStatus === "Pending" && type == "view")) {
			if (data.picklistStatus === "Pending")
				this.router.navigate(["/outbound/packing/items", data.id], {
					queryParams: {
						status: data.picklistStatus,
					},
				});
			else
				this.router.navigate(["/outbound/packing/items", data.id], {
					queryParams: {
						status: data.picklistStatus,
					},
				});
		}
	}

	onDelete(data: PicklistDTO): void {
		Swal.fire({
			title: "Delete Picklist?",
			text: `Are you sure you want to delete ${data.name}?`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "Yes, Delete",
			cancelButtonText: "Cancel",
			confirmButtonColor: "#d33",
		}).then((result) => {
			if (!result.isConfirmed) return;

			this.picklistService.delete(data.id).subscribe({
				next: (res) => {
					Swal.fire({
						title: "Deleted!",
						text: res.message,
						icon: "success",
						timer: 2000,
						showConfirmButton: false,
					});

					this.onSearch();
				},
			});
		});
	}
}
