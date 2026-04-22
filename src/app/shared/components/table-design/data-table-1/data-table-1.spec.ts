import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DataTable1 } from "./data-table-1";

describe("DataTable1", () => {
	let component: DataTable1;
	let fixture: ComponentFixture<DataTable1>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [DataTable1],
		}).compileComponents();

		fixture = TestBed.createComponent(DataTable1);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
