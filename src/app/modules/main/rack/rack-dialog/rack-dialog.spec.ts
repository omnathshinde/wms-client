import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RackDialog } from "./rack-dialog";

describe("RackDialog", () => {
	let component: RackDialog;
	let fixture: ComponentFixture<RackDialog>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [RackDialog],
		}).compileComponents();

		fixture = TestBed.createComponent(RackDialog);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
