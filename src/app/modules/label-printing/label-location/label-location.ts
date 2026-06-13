import { Component } from "@angular/core";
import { FormGroup } from "@angular/forms";
import Swal from "sweetalert2";

import { ShelfDTO } from "src/app/@types/models/ShelfDTO";
import { AppComponent } from "src/app/core/configs/app.component";
import { AppModule } from "src/app/core/configs/app.module";
import { UiComponent } from "src/app/ui/ui.component";

@Component({
	selector: "app-label-location",
	imports: [AppComponent, AppModule],
	templateUrl: "./label-location.html",
	styleUrl: "./label-location.scss",
})
export class LabelLocation extends UiComponent {
	apiUrl = "shelf/search/records";
	displayedColumns = [
		{ label: "Barcode", accessor: "barcode" as const },
		{ label: "Location", accessor: "name" as const },
		{ label: "Rack", accessor: (row: ShelfDTO) => row.rack?.name ?? "-" },
		{ label: "Zone", accessor: (row: ShelfDTO) => row.rack?.zone?.name ?? "-" },
		{ label: "Site", accessor: (row: ShelfDTO) => row.rack?.zone?.site?.name ?? "-" },
		{ label: "Created At", accessor: "createdAt" as const, date: true },
		{ label: "Created By", accessor: "createdBy" as const },
	];
	get actionButtons() {
		return [{ icon: "print", type: "print", tooltip: "Print the barcode" }];
	}

	filterFields: Partial<Record<keyof ShelfDTO, string | number | boolean>> = {
		status: 1,
		name: "",
	};

	searchForm: FormGroup = this.fb.group({
		name: [""],
	});

	onSearch(): void {
		const formValue = this.searchForm.value;

		this.filterFields = {
			status: 1,
			name: formValue.name?.trim() || "",
		};
	}

	onReset(): void {
		this.searchForm.reset({
			name: "",
		});

		this.filterFields = { status: 1, name: "" };
	}

	onAction(event: { type: string; data: ShelfDTO }): void {
		switch (event.type) {
			case "print":
				this.onPrint(event.data);
				break;
			case "restore":
				this.onRestore(event.data);
				break;
			default:
				this.toastr.error("Unknown action");
		}
	}

	onPrint(_data: ShelfDTO): void {
		this.toastr.warning(`Label printing functionality coming soon!`);
	}

	onRestore(data: ShelfDTO): void {
		Swal.fire({
			title: "Reactivate Location?",
			text: "This action will reactivate the location.",
			icon: "question",
			showCancelButton: true,
			confirmButtonText: "Yes, restore it",
			cancelButtonText: "Cancel",
		}).then((result) => {
			if (!result.isConfirmed) return;
			this.shelfService.restore(data.id).subscribe(() => {
				this.toastr.success("Location restored successfully");
				this.onSearch();
			});
		});
	}
}
