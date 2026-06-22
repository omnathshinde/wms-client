import { Component, OnInit, signal } from "@angular/core";
import { FormGroup, Validators } from "@angular/forms";
import { debounceTime, distinctUntilChanged } from "rxjs";

import { CustomerDTO } from "src/app/@types/models/CustomerDTO";
import { MaterialDTO } from "src/app/@types/models/MaterialDTO";
import { PicklistDTO } from "src/app/@types/models/PicklistDTO";
import { SiteDTO } from "src/app/@types/models/SiteDTO";
import { AppComponent } from "src/app/core/configs/app.component";
import { AppModule } from "src/app/core/configs/app.module";
import { UiComponent } from "src/app/ui/ui.component";

@Component({
	selector: "app-picking",
	imports: [AppComponent, AppModule],
	templateUrl: "./picking.html",
	styleUrl: "./picking.scss",
})
export class Picking extends UiComponent implements OnInit {
	form!: FormGroup;

	customers = signal<CustomerDTO[]>([]);
	materials = signal<MaterialDTO[]>([]);
	sites = signal<SiteDTO[]>([]);

	selectedMaterial = false;

	picklistItems = signal<
		{ siteId?: number | string; customerName: string; materialName: string; quantity: number }[]
	>([]);

	displayedColumns = ["customerName", "materialName", "quantity", "action"];

	userSiteId = this.authService.user()?.siteId ?? null;
	userSiteName = this.authService.user()?.site ?? "";

	apiUrl = "picklist";
	displayedColumns1 = [
		{ label: "Name", accessor: "name" as const },
		{ label: "Status", accessor: "picklistStatus" as const },
		{ label: "Picker", accessor: (row: PicklistDTO) => row.user?.name ?? "-" },
		{ label: "Created At", accessor: "createdAt" as const, date: true },
		{ label: "Created By", accessor: "createdBy" as const },
	];

	ngOnInit(): void {
		this.form = this.fb.group({
			siteId: [this.userSiteId, Validators.required],
			customerName: ["", Validators.required],
			materialName: ["", Validators.required],
			availableQuantity: [{ value: 0, disabled: true }],
			quantity: [1, [Validators.required, Validators.min(1)]],
		});

		if (this.userSiteId) {
			this.form.patchValue({
				siteId: this.userSiteId,
			});
			this.sites.update((sites) => [
				...sites,
				{
					id: this.userSiteId,
					name: this.userSiteName,
				} as SiteDTO,
			]);
			this.form.get("siteId")?.disable();
		} else {
			this.loadSites();
		}

		this.form.get("siteId")?.valueChanges.subscribe(() => {
			this.form.patchValue({
				customerName: "",
				materialName: "",
				availableQuantity: 0,
				quantity: 1,
			});

			this.customers.set([]);
			this.materials.set([]);
		});
		this.form
			.get("customerName")
			?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
			.subscribe((search) => {
				if (!search) return;
				const siteId = this.userSiteId ?? this.form.get("siteId")?.value;
				if (!siteId) {
					this.toastr.warning("Please select site first");
					return;
				}
				this.customerService.search(`?status=1&siteId=${siteId}&name=${search}`).subscribe((res) => {
					if (!res.rows.length) {
						this.toastr.warning("Customer Not found");
						return;
					}
					this.customers.set(res.rows as CustomerDTO[]);
				});
			});

		this.form
			.get("materialName")
			?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
			.subscribe((search) => {
				if (this.selectedMaterial) {
					this.selectedMaterial = false;
					return;
				}

				this.form.patchValue(
					{
						availableQuantity: 0,
						quantity: 1,
					},
					{ emitEvent: false },
				);

				if (!search) {
					this.materials.set([]);
					return;
				}
				const siteId = this.userSiteId ?? this.form.get("siteId")?.value;
				if (!siteId) {
					this.toastr.warning("Please select site first");
					return;
				}
				this.materialService.search(`?status=1&siteId=${siteId}&name=${search}`).subscribe((res) => {
					if (!res?.rows?.length) {
						this.toastr.warning("Material Not found");
						return;
					}
					this.materials.set(res.rows as MaterialDTO[]);
				});
			});
	}

	loadSites(): void {
		this.siteService.getAll("?status=1").subscribe({
			next: (res) => {
				this.sites.set(res.rows as SiteDTO[]);
				if (this.userSiteId) {
					this.form.patchValue({
						siteId: this.userSiteId,
					});

					this.form.get("siteId")?.disable();
				}
			},
		});
	}

	onMaterialChange(materialName: string): void {
		this.selectedMaterial = true;
		const material = this.materials().find((m) => m.name === materialName);
		if (!material) return;
		this.form.patchValue({
			availableQuantity: material.quantity ?? 0,
		});
	}

	get canAddMaterial(): boolean {
		const quantity = this.form.get("quantity")?.value ?? 0;
		const availableQuantity = this.form.get("availableQuantity")?.value ?? 0;
		return this.form.valid && availableQuantity > 0 && quantity > 0 && quantity <= availableQuantity;
	}

	addMaterial(): void {
		if (this.form.invalid) return;

		const data = this.form.getRawValue();

		if (data.availableQuantity <= 0) {
			this.toastr.warning("Stock is not available for selected material");
			return;
		}

		if (data.quantity > data.availableQuantity) {
			this.toastr.warning(`Quantity cannot exceed available quantity (${data.availableQuantity})`);
			return;
		}

		const alreadyExists = this.picklistItems().some(
			(item) => item.customerName === data.customerName && item.materialName === data.materialName,
		);

		if (alreadyExists) {
			this.toastr.warning("Material already added for this customer");
			return;
		}

		this.picklistItems.update((items) => [
			...items,
			{
				customerName: data.customerName,
				materialName: data.materialName,
				availableQuantity: data.availableQuantity,
				quantity: data.quantity,
			},
		]);

		this.form.patchValue({
			materialName: "",
			availableQuantity: 0,
			quantity: 1,
		});
	}

	remove(index: number): void {
		this.picklistItems.update((items) => items.filter((_, i) => i !== index));
	}

	createPicklist(): void {
		if (!this.picklistItems().length) {
			this.toastr.warning("Please add at least one material");
			return;
		}

		this.picklistService.create(this.picklistItems()).subscribe({
			next: (res) => {
				this.toastr.success(res.message);

				this.picklistItems.set([]);

				this.form.patchValue({
					customerName: "",
					materialName: "",
					availableQuantity: 0,
					quantity: 1,
				});
			},
		});
	}
}
