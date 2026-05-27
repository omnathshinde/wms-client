import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DataTable3 } from "./data-table-3";

describe("DataTable3", () => {
	let component: DataTable3;
	let fixture: ComponentFixture<DataTable3>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [DataTable3],
		}).compileComponents();

		fixture = TestBed.createComponent(DataTable3);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
