import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";

import { PicklistItemsBarcodeDTO } from "src/app/@types/models/PicklistItemsBarcodeDTO";
import { PicklistItemsDTO } from "src/app/@types/models/PicklistItemsDTO";
import { AppComponent } from "src/app/core/configs/app.component";
import { AppModule } from "src/app/core/configs/app.module";
import { UiComponent } from "src/app/ui/ui.component";

@Component({
	selector: "app-packing-items-barcode",
	imports: [AppComponent, AppModule],
	templateUrl: "./packing-items-barcode.html",
	styleUrl: "./packing-items-barcode.scss",
})
export class PackingItemsBarcode extends UiComponent implements OnInit {
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

	filterFields1: Partial<Record<keyof PicklistItemsDTO, string | number | boolean>> = {
		status: 1,
	};
	filterFields2: Partial<Record<keyof PicklistItemsBarcodeDTO, string | number | boolean>> = {
		status: 1,
	};

	searchForm: FormGroup = this.fb.group({
		materialName: [""],
		barcode: [""],
	});

	picklistId!: number | string;
	ngOnInit(): void {
		this.picklistId = Number(this.route.snapshot.paramMap.get("picklistId"));
		this.route.queryParams.subscribe((params) => {
			const status = params["status"];
			if (status === "In Progress") {
				this.router.navigate(["outbound/packing"]);
			}
		});
		this.onSearch();
		this.searchForm.valueChanges.subscribe(() => {
			this.onSearch();
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

	onSearch(): void {
		const formValue = this.searchForm.getRawValue();

		this.filterFields1 = {
			status: 1,
			picklistId: this.picklistId,
			materialName: formValue.materialName?.trim() || "",
		};

		this.filterFields2 = {
			status: 1,
			picklistId: this.picklistId,
			barcode: formValue.barcode?.trim() || "",
			materialName: formValue.materialName?.trim() || "",
		};
	}

	onReset(): void {
		this.searchForm.reset({
			materialName: "",
			barcode: "",
		});

		this.filterFields1 = {
			status: 1,
			picklistId: this.picklistId,
			materialName: "",
		};

		this.filterFields2 = {
			status: 1,
			picklistId: this.picklistId,
			barcode: "",
		};
	}
}
