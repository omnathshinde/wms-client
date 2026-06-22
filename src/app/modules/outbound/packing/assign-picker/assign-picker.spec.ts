import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AssignPicker } from "./assign-picker";

describe("AssignPicker", () => {
	let component: AssignPicker;
	let fixture: ComponentFixture<AssignPicker>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [AssignPicker],
		}).compileComponents();

		fixture = TestBed.createComponent(AssignPicker);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
