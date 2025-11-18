import { BreakpointObserver } from "@angular/cdk/layout";
import { computed, inject, Injectable, signal } from "@angular/core";

export enum AppBreakpoints {
	Handset = "(max-width: 599px)",
	Tablet = "(min-width: 600px) and (max-width: 1023px)",
	Desktop = "(min-width: 1024px)",
}

@Injectable({ providedIn: "root" })
export class LayoutService {
	private breakpointObserver = inject(BreakpointObserver);

	private readonly _isHandset = signal(false);
	private readonly _isTablet = signal(false);
	private readonly _isDesktop = signal(false);

	readonly isHandset = this._isHandset.asReadonly();
	readonly isTablet = this._isTablet.asReadonly();
	readonly isDesktop = this._isDesktop.asReadonly();

	readonly isMobile = computed(() => this._isHandset() || this._isTablet());

	constructor() {
		this.breakpointObserver
			.observe([AppBreakpoints.Handset, AppBreakpoints.Tablet, AppBreakpoints.Desktop])
			.subscribe((state) => {
				// Reset first to avoid overlap
				this._isHandset.set(false);
				this._isTablet.set(false);
				this._isDesktop.set(false);

				if (state.breakpoints[AppBreakpoints.Handset]) {
					this._isHandset.set(true);
				} else if (state.breakpoints[AppBreakpoints.Tablet]) {
					this._isTablet.set(true);
				} else if (state.breakpoints[AppBreakpoints.Desktop]) {
					this._isDesktop.set(true);
				}
			});
	}
}
