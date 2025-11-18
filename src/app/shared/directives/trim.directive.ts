import { Directive, ElementRef, HostListener, inject } from "@angular/core";
import { NgControl } from "@angular/forms";

@Directive({
	selector: "input[appTrim], textarea[appTrim]",
})
export class TrimDirective {
	private readonly elementRef = inject(ElementRef<HTMLInputElement | HTMLTextAreaElement>);
	private readonly control = inject(NgControl);

	@HostListener("input")
	onInput(): void {
		const value = this.elementRef.nativeElement.value;

		if (typeof value === "string") {
			const trimmed = value.trimStart();
			if (trimmed !== value) {
				this.elementRef.nativeElement.value = trimmed;
				this.control.control?.setValue(trimmed, { emitEvent: false });
			}
		}
	}

	@HostListener("blur")
	onBlur(): void {
		const value = this.elementRef.nativeElement.value;

		if (typeof value === "string") {
			const trimmed = value.trim();
			this.elementRef.nativeElement.value = trimmed;
			this.control.control?.setValue(trimmed, { emitEvent: true });
		}
	}
}
