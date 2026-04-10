import { Directive, ElementRef, inject, Input, OnDestroy, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { filter, Subscription } from "rxjs";

@Directive({
	selector: "[appNavActive]",
	standalone: true,
})
export class NavActiveDirective implements OnInit, OnDestroy {
	private el = inject(ElementRef<HTMLElement>);
	private router = inject(Router);

	private sub!: Subscription;

	@Input("appNavActive") routes!: string | string[];

	ngOnInit(): void {
		this.update();
		this.sub = this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => this.update());
	}

	private update(): void {
		if (!this.routes) return;

		const routes = Array.isArray(this.routes) ? this.routes : [this.routes];

		const isActive = routes.some((route) =>
			this.router.isActive(route, {
				paths: "subset",
				queryParams: "subset",
				fragment: "ignored",
				matrixParams: "ignored",
			}),
		);

		this.el.nativeElement.classList.toggle("full-active", isActive);
	}

	ngOnDestroy(): void {
		this.sub?.unsubscribe();
	}
}
