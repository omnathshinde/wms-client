import { Component, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { debounceTime, distinctUntilChanged } from "rxjs";

import { MaterialDTO } from "src/app/interfaces/models/MaterialDTO";
import { SiteDTO } from "src/app/interfaces/models/SiteDTO";
import { AppComponent } from "@app/core/configs/app.component";
import { AppModule } from "@app/core/configs/app.module";
import { UiComponent } from "@app/ui/ui.component";

@Component({
	selector: "app-inward",
	imports: [AppModule, AppComponent],
	templateUrl: "./inward.html",
	styleUrl: "./inward.scss",
})
export class Inward extends UiComponent implements OnInit {
	apiUrl = "inward";
	reloadTable = 0;
	isAdmin = true;
	sites: SiteDTO[] = [];
	materials: MaterialDTO[] = [];
	materialSearchControl = new FormControl(null);

	displayedColumns = [
		{ label: "Barcode", accessor: "barcode" },
		{ label: "Material", accessor: "materialName" },
		{ label: "Batch", accessor: "batch" },
		{ label: "Quantity", accessor: "quantity" },
		{ label: "Invoice", accessor: "invoice" },
		{ label: "QC Status", accessor: "qcStatus" },
		{ label: "Created At", accessor: "createdAt", date: true },
	];

	ngOnInit(): void {
		this.materialSearchControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe((search) => {
			this.searchMaterial(search ?? "");
		});
	}

	form = this.fb.group({
		siteId: this.fb.control<number | null>(null),
		materialId: this.fb.control<number | null>(null, Validators.required),
		batch: this.fb.control("", Validators.required),
		inwardQuantity: this.fb.control(1, [Validators.required, Validators.min(1), Validators.pattern(/^[0-9]+$/)]),
		invoice: this.fb.control("", Validators.required),
		manufacturingDate: this.fb.control<Date | null>(null, Validators.required),
	});

	onMaterialSelected(event: MatAutocompleteSelectedEvent): void {
		this.form.patchValue({
			materialId: event.option.value,
		});
	}

	searchMaterial(search: string): void {
		console.log(search);

		// this.materialService.search(...)
	}
	onSave(): void {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

		const payload = {
			...this.form.getRawValue(),
			autoSerial: true,
		};

		console.log(payload);

		this.inwardService.create(payload).subscribe((res) => {
			this.toastr.success(res.message);
		});
	}

	onReset(): void {
		this.form.reset({
			inwardQuantity: 1,
		});
	}

	onUpload(): void {
		console.log("Upload");
	}

	onUploadSrNo(): void {
		console.log("Upload");
	}
}
