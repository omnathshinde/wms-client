import { Component, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { debounceTime, distinctUntilChanged } from "rxjs";

import { MaterialDTO } from "src/app/@types/models/MaterialDTO";
import { SiteDTO } from "src/app/@types/models/SiteDTO";
import { AppComponent } from "src/app/core/configs/app.component";
import { AppModule } from "src/app/core/configs/app.module";
import { UiComponent } from "src/app/ui/ui.component";

@Component({
	selector: "app-inward",
	imports: [AppModule, AppComponent],
	templateUrl: "./inward.html",
	styleUrl: "./inward.scss",
})
export class Inward extends UiComponent implements OnInit {
	maxDate: Date = new Date();

	userSiteId: number | string | null = null;
	userSiteName = "";

	sites: SiteDTO[] = [];
	materials: MaterialDTO[] = [];

	selectedMaterial: MaterialDTO | null = null;
	materialSearchControl = new FormControl<string>("", {
		nonNullable: true,
	});

	ngOnInit(): void {
		this.loadSites();
		this.form.controls.siteId.valueChanges.subscribe((siteId) => {
			if (!siteId) {
				return;
			}
			this.selectedMaterial = null;
			this.materials = [];
			this.materialSearchControl.setValue("", { emitEvent: false });
			this.form.patchValue({ materialId: null, shelfName: null });
		});
		this.materialSearchControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe((search) => {
			if (this.selectedMaterial && search !== this.selectedMaterial.name) {
				this.selectedMaterial = null;
				this.form.patchValue({
					materialId: null,
				});
			}
			this.searchMaterial(search ?? "");
		});
	}

	loadSites(): void {
		this.siteService.getAll<SiteDTO>("status=1").subscribe({
			next: (res) => {
				if (!res?.rows?.length) {
					this.toastr.warning("Site Not found");
					return;
				}
				this.sites = res.rows;
				if (this.userSiteId) {
					const site = this.sites.find((x) => x.id === this.userSiteId);
					this.userSiteName = site?.name ?? "";
					this.form.patchValue({
						siteId: this.userSiteId,
					});
					this.form.controls.siteId.disable();
				}
			},
		});
	}

	form = this.fb.group({
		siteId: this.fb.control<number | string | null>(null),
		materialId: this.fb.control<number | string | null>(null, Validators.required),
		batch: this.fb.control("", Validators.required),
		inwardQuantity: this.fb.control(1, [Validators.required, Validators.min(1), Validators.pattern(/^[0-9]+$/)]),
		invoice: this.fb.control("", Validators.required),
		manufacturingDate: this.fb.control<Date | null>(null, Validators.required),
		shelfName: this.fb.control<number | string | null>(null),
	});

	onMaterialSelected(event: MatAutocompleteSelectedEvent): void {
		const material = event.option.value as MaterialDTO;
		this.selectedMaterial = material;
		this.materialSearchControl.setValue(material.name, { emitEvent: false });
		this.form.patchValue({ materialId: material.id });
	}

	searchMaterial(search: string): void {
		const siteId = this.form.getRawValue().siteId;
		if (!search.trim()) {
			this.materials = [];
			return;
		}
		if (!siteId) {
			this.materials = [];
			return;
		}

		this.materialService
			.search<MaterialDTO>(`?status=1&siteId=${siteId}&name=${search}&limit=10`)
			.subscribe((res) => {
				this.materials = res.rows;
			});
	}

	displayMaterial(material: MaterialDTO | null): string {
		return material?.name ?? "";
	}

	onSave(): void {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}
		const payload = { ...this.form.getRawValue(), autoSerial: true };
		this.inwardService.create(payload).subscribe((res) => {
			this.toastr.success(res.message);
			this.onReset();
		});
	}

	onReset(): void {
		this.selectedMaterial = null;
		this.materials = [];
		this.materialSearchControl.setValue("", { emitEvent: false });
		this.form.reset({ siteId: this.userSiteId, inwardQuantity: 1 });
	}

	onUpload(): void {
		this.toastr.warning("Funtinality comming soon");
	}

	onUploadSrNo(): void {
		this.toastr.warning("Funtinality comming soon");
	}
}
