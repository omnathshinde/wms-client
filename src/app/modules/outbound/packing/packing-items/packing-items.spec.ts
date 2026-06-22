import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PackingItems } from "./packing-items";

describe("PackingItems", () => {
	let component: PackingItems;
	let fixture: ComponentFixture<PackingItems>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [PackingItems],
		}).compileComponents();

		fixture = TestBed.createComponent(PackingItems);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
