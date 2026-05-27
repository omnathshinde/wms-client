import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DataTable2 } from "./data-table-2";

describe("DataTable2", () => {
	let component: DataTable2;
	let fixture: ComponentFixture<DataTable2>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [DataTable2],
		}).compileComponents();

		fixture = TestBed.createComponent(DataTable2);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
