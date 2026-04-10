import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Putaway } from "./putaway";

describe("Putaway", () => {
	let component: Putaway;
	let fixture: ComponentFixture<Putaway>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [Putaway],
		}).compileComponents();

		fixture = TestBed.createComponent(Putaway);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
