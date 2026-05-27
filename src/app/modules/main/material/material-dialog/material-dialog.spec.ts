import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MaterialDialog } from "./material-dialog";

describe("MaterialDialog", () => {
	let component: MaterialDialog;
	let fixture: ComponentFixture<MaterialDialog>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MaterialDialog],
		}).compileComponents();

		fixture = TestBed.createComponent(MaterialDialog);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
