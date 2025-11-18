import { Injectable, signal } from "@angular/core";

export type ThemeChoice = "light" | "dark" | "system";
const THEME_KEY = "theme";

@Injectable({ providedIn: "root" })
export class ThemeService {
	private readonly theme = signal<ThemeChoice>("system");
	private readonly media = window.matchMedia("(prefers-color-scheme: dark)");

	constructor() {
		const saved = (localStorage.getItem(THEME_KEY) as ThemeChoice) || "system";
		this.theme.set(saved);
		this.apply(saved);

		this.media.addEventListener("change", () => {
			if (this.theme() === "system") this.apply("system");
		});
	}

	toggle(): void {
		const next = this.isDark() ? "light" : "dark";
		this.set(next);
	}

	set(choice: ThemeChoice): void {
		this.theme.set(choice);
		localStorage.setItem(THEME_KEY, choice);
		this.apply(choice);
	}

	isDark(): boolean {
		return this.theme() === "dark" || (this.theme() === "system" && this.media.matches);
	}

	private apply(choice: ThemeChoice): void {
		const html = document.documentElement;
		const dark = choice === "dark" || (choice === "system" && this.media.matches);
		html.classList.toggle("dark", dark);
	}
}
