import { OverlayContainer } from "@angular/cdk/overlay";
import { DOCUMENT } from "@angular/common";
import { inject, Injectable, signal } from "@angular/core";

export type ThemeChoice = "light" | "dark";

const THEME_KEY = "theme";

@Injectable({ providedIn: "root" })
export class ThemeService {
	private readonly document = inject(DOCUMENT);
	private readonly overlayContainer = inject(OverlayContainer);

	private readonly theme = signal<ThemeChoice>("light");

	constructor() {
		const saved = (localStorage.getItem(THEME_KEY) as ThemeChoice | null) ?? "light";
		this.set(saved);
	}

	currentTheme(): ThemeChoice {
		return this.theme();
	}

	toggle(): void {
		const next: ThemeChoice = this.isDark() ? "light" : "dark";
		this.set(next);
	}

	set(choice: ThemeChoice): void {
		this.theme.set(choice);
		localStorage.setItem(THEME_KEY, choice);
		this.apply();
	}

	isDark(): boolean {
		return this.theme() === "dark";
	}

	apply(): void {
		const body = this.document.body;
		const overlayClasses = this.overlayContainer.getContainerElement().classList;
		const dark = this.isDark();

		body.classList.toggle("light-theme", !dark);
		body.classList.toggle("dark-theme", dark);

		overlayClasses.toggle("light-theme", !dark);
		overlayClasses.toggle("dark-theme", dark);
	}
}
