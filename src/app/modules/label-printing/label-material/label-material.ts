import { Component, inject } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";

import { InwardDTO } from "src/app/@types/models/InwardDTO";
import { AppComponent } from "src/app/core/configs/app.component";
import { AppModule } from "src/app/core/configs/app.module";

@Component({
	selector: "app-label-material",
	imports: [AppComponent, AppModule],
	templateUrl: "./label-material.html",
	styleUrl: "./label-material.scss",
})
export class LabelMaterial {
	private readonly toastr = inject(ToastrService);
	private readonly fb = inject(FormBuilder);
	private readonly dialog = inject(MatDialog);

	apiUrl = "inward/search/records";
	displayedColumns = [
		{ label: "Barcode", accessor: "barcode" as const },
		{ label: "Material Name", accessor: (row: InwardDTO) => row.material?.name ?? "-" },
		{ label: "Inward At", accessor: "createdAt" as const, date: true },
		{ label: "Inward By", accessor: "createdBy" as const },
	];
	get actionButtons() {
		return [{ icon: "print", type: "print", tooltip: "Print the barcode" }];
	}

	filterFields: Partial<Record<keyof InwardDTO, string | number | boolean>> = {
		status: 1,
		inStock: 1,
		barcode: "",
	};

	searchForm: FormGroup = this.fb.group({
		barcode: [""],
	});

	onSearch(): void {
		const formValue = this.searchForm.value;

		this.filterFields = {
			status: 1,
			inStock: 1,
			barcode: formValue.name?.trim() || "",
		};
	}

	onReset(): void {
		this.searchForm.reset({
			barcode: "",
		});

		this.filterFields = { status: 1, inStock: 1, barcode: "" };
	}

	onAction(_event: { type: string; data: InwardDTO }): void {
		this.toastr.warning(`Label printing functionalitycoming soon!`);
	}
}
