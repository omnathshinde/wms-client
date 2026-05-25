import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ShelfDialog } from "./shelf-dialog";

describe("ShelfDialog", () => {
	let component: ShelfDialog;
	let fixture: ComponentFixture<ShelfDialog>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ShelfDialog],
		}).compileComponents();

		fixture = TestBed.createComponent(ShelfDialog);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
