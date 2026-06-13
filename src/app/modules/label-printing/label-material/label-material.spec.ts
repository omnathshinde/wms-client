import { ComponentFixture, TestBed } from "@angular/core/testing";

import { LabelMaterial } from "./label-material";

describe("LabelMaterial", () => {
	let component: LabelMaterial;
	let fixture: ComponentFixture<LabelMaterial>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [LabelMaterial],
		}).compileComponents();

		fixture = TestBed.createComponent(LabelMaterial);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
