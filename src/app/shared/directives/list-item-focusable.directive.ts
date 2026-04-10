import { FocusableOption, FocusMonitor, FocusOrigin } from "@angular/cdk/a11y";
import { AfterViewInit, Directive, ElementRef, inject, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";

@Directive({
	selector: "[appListItemFocusable]",
	standalone: true,
})
export class ListItemFocusable implements FocusableOption, AfterViewInit, OnDestroy {
	// Stream that emits when the item is focused.
	public readonly focused = new Subject<ListItemFocusable>();
	public readonly elementRef = inject(ElementRef);
	public readonly focusMonitor = inject(FocusMonitor);

	public ngAfterViewInit() {
		// Start monitoring the element so it gets the appropriate focused classes.
		this.focusMonitor.monitor(this.elementRef, false).subscribe((origin) => {
			if (origin) {
				this.focused.next(this);
			}
		});
	}

	public focus(origin?: FocusOrigin, options?: FocusOptions): void {
		this.elementRef.nativeElement.focus(options);
	}

	public ngOnDestroy(): void {
		this.focusMonitor.stopMonitoring(this.elementRef);
		this.focused.complete();
	}
}
