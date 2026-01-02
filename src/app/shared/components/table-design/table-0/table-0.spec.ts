import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Table0 } from "./table-0";

describe("Table0", () => {
	let component: Table0;
	let fixture: ComponentFixture<Table0>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [Table0],
		}).compileComponents();

		fixture = TestBed.createComponent(Table0);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
