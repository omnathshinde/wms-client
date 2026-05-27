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

	// 🔹 Screen signals
	private readonly _isHandset = signal(false);
	private readonly _isTablet = signal(false);
	private readonly _isDesktop = signal(false);

	readonly isHandset = this._isHandset.asReadonly();
	readonly isTablet = this._isTablet.asReadonly();
	readonly isDesktop = this._isDesktop.asReadonly();

	// 🔹 Computed helpers
	readonly isMobile = computed(() => this._isHandset() || this._isTablet());
	readonly isDesktopOrTablet = computed(() => !this._isHandset());

	// 🔹 Sidebar state
	private readonly _sidebarOpen = signal(true);
	readonly sidebarOpen = this._sidebarOpen.asReadonly();

	constructor() {
		this.breakpointObserver
			.observe([AppBreakpoints.Handset, AppBreakpoints.Tablet, AppBreakpoints.Desktop])
			.subscribe((state) => {
				this._isHandset.set(state.breakpoints[AppBreakpoints.Handset]);
				this._isTablet.set(state.breakpoints[AppBreakpoints.Tablet]);
				this._isDesktop.set(state.breakpoints[AppBreakpoints.Desktop]);

				// Auto close sidebar on mobile
				if (this.isMobile()) {
					this._sidebarOpen.set(false);
				} else {
					this._sidebarOpen.set(true);
				}
			});
	}

	// 🔹 Sidebar controls
	toggleSidebar() {
		this._sidebarOpen.set(!this._sidebarOpen());
	}

	openSidebar() {
		this._sidebarOpen.set(true);
	}

	closeSidebar() {
		this._sidebarOpen.set(false);
	}
}
