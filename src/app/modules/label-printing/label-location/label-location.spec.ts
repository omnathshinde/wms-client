import { ComponentFixture, TestBed } from "@angular/core/testing";

import { LabelLocation } from "./label-location";

describe("LabelLocation", () => {
	let component: LabelLocation;
	let fixture: ComponentFixture<LabelLocation>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [LabelLocation],
		}).compileComponents();

		fixture = TestBed.createComponent(LabelLocation);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
