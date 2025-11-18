import { Directive, ElementRef, inject, OnInit, Renderer2 } from "@angular/core";

import { AuthService } from "src/app/core/auth/auth.service";

@Directive({
	selector: "[appPermission]",
})
export class PermissionDirective implements OnInit {
	private el = inject(ElementRef<HTMLButtonElement>);
	private renderer = inject(Renderer2);
	private auth = inject(AuthService);

	ngOnInit(): void {
		const user = this.auth.getUser();

		const isAdmin = user?.role === "admin";

		if (!isAdmin) {
			this.renderer.setAttribute(this.el.nativeElement, "disabled", "true");
			this.renderer.addClass(this.el.nativeElement, "disabled-btn");
		}
	}
}
