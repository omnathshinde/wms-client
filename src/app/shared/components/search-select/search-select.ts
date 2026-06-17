import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from "@angular/core";
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from "@angular/forms";
import { debounceTime, distinctUntilChanged, filter, Observable } from "rxjs";

import { ApiResponse } from "src/app/@types/common/ApiResponse";
import { AppModule } from "src/app/core/configs/app.module";

export interface SearchItem {
	id: number;
	[key: string]: string | number | boolean | null | undefined;
}

@Component({
	selector: "app-search-select",
	imports: [AppModule],
	templateUrl: "./search-select.html",
	styleUrl: "./search-select.scss",
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => SearchSelect),
			multi: true,
		},
	],
})
export class SearchSelect<T extends SearchItem> implements OnInit, ControlValueAccessor {
	@Input({ required: true }) label!: string;

	@Input({ required: true })
	service!: { search(query: string): Observable<ApiResponse<T>> };

	@Input() query = "";
	@Input() searchField = "name";
	@Input() displayField: keyof T = "name" as keyof T;
	@Input() placeholder = "Enter a name";

	@Output()
	selectionChange = new EventEmitter<T>();

	searchControl = new FormControl<string>("", {
		nonNullable: true,
	});

	options: T[] = [];

	private onChange: (value: string | null) => void = (_: string | null) => undefined;
	protected onTouched: () => void = () => undefined;

	ngOnInit(): void {
		this.searchControl.valueChanges
			.pipe(
				filter((value) => typeof value === "string"),
				debounceTime(300),
				distinctUntilChanged(),
			)
			.subscribe((value) => {
				this.search(value);
			});
	}

	search(value: string): void {
		const query = `?${this.query}&${this.searchField}=${encodeURIComponent(value)}`;

		this.service.search(query).subscribe({
			next: (res: ApiResponse<T>) => {
				this.options = res.rows ?? [];
			},
		});
	}

	select(option: T): void {
		const displayValue = String(option[this.displayField] ?? "");

		this.searchControl.setValue(displayValue, {
			emitEvent: false,
		});

		this.onChange(displayValue);
		this.selectionChange.emit(option);
	}

	displayFn = (value: T | string | null): string => {
		if (!value) return "";

		if (typeof value === "string") {
			return value;
		}

		return String(value[this.displayField] ?? "");
	};

	writeValue(value: string | null): void {
		this.searchControl.setValue(value ?? "", {
			emitEvent: false,
		});
	}

	registerOnChange(fn: (value: string | null) => void): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: () => void): void {
		this.onTouched = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		if (isDisabled) {
			this.searchControl.disable();
		} else {
			this.searchControl.enable();
		}
	}
}
