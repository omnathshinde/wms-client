import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ZoneDialog } from "./zone-dialog";

describe("ZoneDialog", () => {
	let component: ZoneDialog;
	let fixture: ComponentFixture<ZoneDialog>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ZoneDialog],
		}).compileComponents();

		fixture = TestBed.createComponent(ZoneDialog);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
