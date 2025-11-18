import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UserDailog } from "./user-dailog";

describe("UserDailog", () => {
	let component: UserDailog;
	let fixture: ComponentFixture<UserDailog>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [UserDailog],
		}).compileComponents();

		fixture = TestBed.createComponent(UserDailog);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
