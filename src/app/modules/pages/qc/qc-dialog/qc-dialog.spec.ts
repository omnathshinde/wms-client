import { ComponentFixture, TestBed } from "@angular/core/testing";

import { QcDialog } from "./qc-dialog";

describe("QcDialog", () => {
	let component: QcDialog;
	let fixture: ComponentFixture<QcDialog>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [QcDialog],
		}).compileComponents();

		fixture = TestBed.createComponent(QcDialog);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
