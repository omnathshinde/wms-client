import { FocusKeyManager } from "@angular/cdk/a11y";
import { SPACE } from "@angular/cdk/keycodes";
import { AfterViewInit, ContentChildren, Directive, HostListener, OnDestroy, QueryList } from "@angular/core";
import { merge } from "rxjs";
import { startWith, switchMap } from "rxjs/operators";

import { ListItemFocusable } from "./list-item-focusable.directive";

@Directive({
	selector: "[appNavListKeyManager]",
	standalone: true,
})
export class NavListKeyManager implements AfterViewInit, OnDestroy {
	@ContentChildren(ListItemFocusable)
	private items!: QueryList<ListItemFocusable>;

	private keyManager!: FocusKeyManager<ListItemFocusable>;

	@HostListener("keydown", ["$event"])
	onKeydown(event: KeyboardEvent) {
		const activeItem = this.keyManager.activeItem;
		if (event.keyCode === SPACE) {
			if (activeItem) {
				activeItem.elementRef.nativeElement.click();
			}
		} else {
			this.keyManager.setFocusOrigin("keyboard");
			this.keyManager.onKeydown(event);
		}
	}

	public ngAfterViewInit() {
		this.keyManager = new FocusKeyManager(this.items).withWrap();

		// If a user manually (programatically) focuses an item, we need to reflect that focus change back to the key manager.
		this.items.changes
			.pipe(
				startWith(this.items),
				switchMap((items) =>
					merge<ListItemFocusable[]>(...items.map((item: ListItemFocusable) => item.focused)),
				),
			)
			.subscribe((focusedItem) => {
				this.keyManager.updateActiveItem(focusedItem);
			});
	}

	public ngOnDestroy(): void {
		this.keyManager.destroy();
	}
}
