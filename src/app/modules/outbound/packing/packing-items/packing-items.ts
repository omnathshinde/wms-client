import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import Swal from "sweetalert2";

import { PicklistItemsBarcodeDTO } from "src/app/@types/models/PicklistItemsBarcodeDTO";
import { PicklistItemsDTO } from "src/app/@types/models/PicklistItemsDTO";
import { AppComponent } from "src/app/core/configs/app.component";
import { AppModule } from "src/app/core/configs/app.module";
import { UiComponent } from "src/app/ui/ui.component";

interface BarcodeScanResponse {
	message: string;
	picklistStatus: "Pending" | "In Progress" | "Completed";
	created: number;
	restored: number;
	skipped: number;
	details: {
		createdBarcodes: string[];
		restoredBarcodes: string[];
		skippedBarcodes: string[];
	};
}

@Component({
	selector: "app-packing-items",
	imports: [AppComponent, AppModule],
	templateUrl: "./packing-items.html",
	styleUrl: "./packing-items.scss",
})
export class PackingItems extends UiComponent implements OnInit {
	apiUrl1 = `picklist-items/search/records?`;
	apiUrl2 = "picklist-items-barcode/search/records";

	rowColor = (row: PicklistItemsDTO): string => {
		if (row.pickedQuantity === row.materialQuantity) {
			return "#e8f5e9";
		}
		if (row.pickedQuantity > 0) {
			return "#fff8e1";
		}

		return "";
	};

	displayedColumns1 = [
		{ label: "Material Name", accessor: "materialName" as const },
		{ label: "Quantity", accessor: "materialQuantity" as const, align: "center" as const },
		{ label: "Pick Quantity", accessor: "pickedQuantity" as const, align: "center" as const },
	];

	displayedColumns2 = [
		{ label: "Barcode", accessor: "barcode" as const },
		{ label: "Quantity", accessor: "quantity" as const },
		{ label: "Material Name", accessor: (row: PicklistItemsBarcodeDTO) => row.picklistItem?.materialName ?? "-" },
		{ label: "Pick At", accessor: "updatedAt" as const, date: true },
		{ label: "Pick By", accessor: "updatedBy" as const },
	];

	actionButtons = [
		{
			type: "delete",
			icon: "delete",
			tooltip: "Delete Barcode",
			color: "warn",
		},
	];

	filterFields1: Partial<Record<keyof PicklistItemsDTO, string | number | boolean>> = {
		status: 1,
	};
	filterFields2: Partial<Record<keyof PicklistItemsBarcodeDTO, string | number | boolean>> = {
		status: 1,
	};

	searchForm: FormGroup = this.fb.group({
		barcode: [""],
	});

	picklistId!: number | string;
	ngOnInit(): void {
		this.picklistId = Number(this.route.snapshot.paramMap.get("picklistId"));

		this.filterFields1 = {
			status: 1,
			picklistId: this.picklistId,
		};
		this.filterFields2 = {
			status: 1,
			picklistId: this.picklistId,
		};
	}

	onScanBarcode(): void {
		const barcode = this.searchForm.get("barcode")?.value?.trim();

		if (!barcode) {
			return;
		}

		this.picklistItemBarcodeService
			.bulkCreate<
				{
					picklistId: number | string;
					barcodes: string[];
				},
				BarcodeScanResponse
			>({
				picklistId: this.picklistId,
				barcodes: [barcode],
			})
			.subscribe({
				next: (res) => {
					this.toastr.success(res.message);

					this.searchForm.patchValue({
						barcode: "",
					});

					this.refreshTables();

					if (res.picklistStatus === "Completed") {
						this.onCompletePicklist();
						return;
					}

					if (res.picklistStatus === "In Progress") {
						this.updatePicklistStatus("In Progress");
					}
				},
				error: () => {
					this.searchForm.patchValue({
						barcode: "",
					});
				},
			});
	}

	private onCompletePicklist(): void {
		Swal.fire({
			title: "Picklist Completed",
			text: "All items have been picked. Do you want to complete this picklist?",
			icon: "success",
			showCancelButton: true,
			confirmButtonText: "Complete Picklist",
			cancelButtonText: "Cancel",
			allowOutsideClick: false,
		}).then((result) => {
			if (!result.isConfirmed) {
				return;
			}

			this.updatePicklistStatus("Completed", true);
		});
	}
	private updatePicklistStatus(picklistStatus: "In Progress" | "Completed", redirect = false): void {
		this.picklistService
			.update(this.picklistId, {
				picklistStatus,
			})
			.subscribe({
				next: (res) => {
					if (picklistStatus === "Completed") {
						this.toastr.success(res.message);

						if (redirect) {
							this.router.navigate(["/outbound/packing"]);
						}
					}
				},
			});
	}
	refreshTables(): void {
		this.filterFields1 = {
			...this.filterFields1,
		};

		this.filterFields2 = {
			...this.filterFields2,
		};
	}

	onAction(event: { type: string; data: PicklistItemsBarcodeDTO }): void {
		switch (event.type) {
			case "delete":
				this.onDelete(event.data);
				break;

			default:
				this.toastr.error("Unknown action");
		}
	}

	onDelete(data: PicklistItemsBarcodeDTO): void {
		this.picklistItemBarcodeService.delete(data.id).subscribe({
			next: (res) => {
				this.toastr.success(res.message);
				this.refreshTables();
			},
		});
	}
}
