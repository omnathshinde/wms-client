import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { Validators } from "@angular/forms";

import { ShelfDTO } from "src/app/@types/models/ShelfDTO";
import { AppComponent } from "src/app/core/configs/app.component";
import { AppModule } from "src/app/core/configs/app.module";
import { UiComponent } from "src/app/ui/ui.component";

@Component({
	selector: "app-putaway",
	imports: [AppModule, AppComponent],
	templateUrl: "./putaway.html",
	styleUrl: "./putaway.scss",
})
export class Putaway extends UiComponent implements AfterViewInit {
	apiUrl = "inward/search/records";
	displayedColumns = [
		{ label: "Barcode", accessor: "barcode" as const },
		{ label: "Material", accessor: "materialName" as const },
		{ label: "QC Status", accessor: "qcStatus" as const },
		{ label: "Recommanded Location", accessor: "recommandedShelf" as const },
		{ label: "Inward At", accessor: "createdAt" as const, date: true },
		{ label: "Inward By", accessor: "createdBy" as const },
	];
	reloadTable = 0;

	@ViewChild("locationInput") locationInput!: ElementRef<HTMLInputElement>;
	@ViewChild("materialInput") materialInput!: ElementRef<HTMLInputElement>;

	selectedLocation: ShelfDTO | null = null;

	form = this.fb.group({
		locationBarcode: ["", Validators.required],
		materialBarcode: ["", Validators.required],
	});

	ngAfterViewInit(): void {
		this.onFocus("location");
	}

	onScanLocation(): void {
		const barcode = this.form.value.locationBarcode?.trim();
		if (!barcode) {
			this.toastr.error("Enter a valid location barcode");
			return;
		}

		this.shelfService.search<ShelfDTO>(`status=1&barcode=${barcode}`).subscribe({
			next: (res) => {
				const loc = res.rows?.[0] ?? null;
				if (loc) {
					this.selectedLocation = loc;
					this.onFocus("material");
				} else {
					this.toastr.error("Location not found");
					this.form.patchValue({ locationBarcode: "" });
					this.onFocus("location");
				}
			},
			error: () => {
				this.form.patchValue({ locationBarcode: "" });
			},
		});
	}

	onFocus(field: "location" | "material"): void {
		if (field === "location") {
			setTimeout(() => this.materialInput?.nativeElement.focus(), 100);
		} else if (field === "material") {
			setTimeout(() => this.materialInput?.nativeElement.focus(), 100);
		}
	}

	onScanMaterial() {
		if (!this.selectedLocation) {
			this.toastr.warning("Please scan a valid location first");
			this.onFocus("location");
			return;
		}

		const barcodeValue = this.form.value.materialBarcode?.trim();
		if (!barcodeValue) {
			this.toastr.warning("Please scan a valid material barcode");
			return;
		}

		const barcodes = barcodeValue
			.split(/[\s,/\n]+/)
			.map((b) => b.trim())
			.filter((b) => b);
		const payload = {
			barcodes,
			shelfId: this.selectedLocation.id,
			shelfName: this.selectedLocation.name,
		};

		this.putawayService.bulkUpload(payload).subscribe({
			next: () => {
				this.toastr.success(`${barcodes.length} material(s) put away successfully`);
				this.form.patchValue({ materialBarcode: "" });
				this.onFocus("material");
				this.reloadTable++;
			},
			error: () => {
				this.form.patchValue({ materialBarcode: "" });
				this.onFocus("material");
			},
		});
	}

	onReset(): void {
		this.form.reset();
		this.selectedLocation = null;
		this.onFocus("location");
	}
}
