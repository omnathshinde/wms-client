import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";

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
			type: "start",
			icon: "arrow_forward",
			tooltip: "Start Picking",
			color: "primary",
			visible: (row: PicklistDTO) => row.picklistStatus === "Pending" || row.picklistStatus === "In Progress",
		},
		{
			type: "view",
			icon: "remove_red_eye",
			tooltip: "Start Picking",
			color: "primary",
			visible: (row: PicklistDTO) => row.picklistStatus === "Completed",
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
			case "start":
			case "view":
				this.onStart(event.data);
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

	onStart(data: PicklistDTO): void {
		if (data.picklistStatus == "In Progress" || data.picklistStatus === "Pending")
			this.router.navigate(["/outbound/packing", data.id]);
		else this.router.navigate(["/outbound/packing/items", data.id]);
	}
}
