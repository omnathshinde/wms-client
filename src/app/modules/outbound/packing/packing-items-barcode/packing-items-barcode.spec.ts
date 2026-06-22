import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PackingItemsBarcode } from "./packing-items-barcode";

describe("PackingItemsBarcode", () => {
	let component: PackingItemsBarcode;
	let fixture: ComponentFixture<PackingItemsBarcode>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [PackingItemsBarcode],
		}).compileComponents();

		fixture = TestBed.createComponent(PackingItemsBarcode);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
