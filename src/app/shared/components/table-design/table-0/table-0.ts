import { SelectionModel } from "@angular/cdk/collections";
import { HttpClient } from "@angular/common/http";
import {
	Component,
	EventEmitter,
	inject,
	Input,
	OnChanges,
	OnInit,
	Output,
	SimpleChanges,
	ViewChild,
} from "@angular/core";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ToastrService } from "ngx-toastr";

import { ApiResponse } from "src/app/@types/common/ApiResponse";
import { API_URL } from "src/app/app";
import { AppModule } from "src/app/core/configs/app.module";

@Component({
	selector: "app-table-0",
	imports: [AppModule],
	templateUrl: "./table-0.html",
	styleUrl: "./table-0.scss",
})
export class Table0<T extends { id?: number | string }> implements OnInit, OnChanges {
	/** API endpoint to fetch table data (without base URL) */
	@Input() apiUrl = "";

	/** Action buttons shown in each row */
	@Input() actionButtons: { icon: string; type: string; tooltip?: string }[] = [];

	/** Filters applied to API query */
	@Input() filterFields: Partial<Record<keyof T, string | number | boolean>> = {};

	/** Table column configuration */
	@Input() displayedColumns: { label: string; accessor: keyof T | string | "actions"; date?: boolean }[] = [];

	/** Emits action button clicks */
	@Output() action = new EventEmitter<{ type: string; data: T }>();

	/** Emits pagination change events */
	@Output() pageChanged = new EventEmitter<number>();

	/** Emits selected row list */
	@Output() selectedRows = new EventEmitter<T[]>();

	/** Pagination controls */
	limit = 5;
	offset = 0;
	totalCount = 0;
	countLabel = "Total Records: 0 to 0 of 0";
	pageSizeOptions = [5, 10, 50, 100];

	/** Data & selection management */
	dataSource = new MatTableDataSource<T>([]);
	selection = new SelectionModel<T>(true, []);

	/** Internal injections */
	private readonly http = inject(HttpClient);
	private readonly serverUrl = inject(API_URL);
	private readonly toastr = inject(ToastrService);

	@ViewChild(MatPaginator) paginator!: MatPaginator;

	ngOnInit(): void {
		this.getData();
	}
	ngOnChanges(changes: SimpleChanges): void {
		if (changes["filterFields"] && !changes["filterFields"].firstChange) {
			this.offset = 0; // reset pagination
			this.getData();
		}
	}

	/** Fetch data from the server */
	getData(): void {
		this.buildQuery();

		this.http.get<ApiResponse<T>>(this.query).subscribe({
			next: (res) => {
				if (!res?.rows?.length) {
					this.dataSource.data = [];
					this.totalCount = 0;
					this.updateCount();
					this.toastr.warning("No data found");
					return;
				}

				this.dataSource.data = res.rows;
				this.totalCount = res.count || res.rows.length;
				this.updateCount();

				// ✅ Update paginator length after loading new data
				if (this.paginator) {
					this.paginator.length = this.totalCount;
					this.paginator.pageIndex = this.offset / this.limit;
				}
			},
			error: () => {
				this.toastr.error("Error fetching data");
			},
		});
	}

	/** Construct API query with filters and pagination */
	private buildQuery(): void {
		const params = new URLSearchParams({
			limit: this.limit.toString(),
			offset: this.offset.toString(),
		});

		Object.entries(this.filterFields).forEach(([key, value]) => {
			if (value !== undefined && value !== null && value !== "") {
				params.append(key, String(value));
			}
		});

		this.query = `${this.serverUrl}/${this.apiUrl}?${params.toString()}`;
	}

	/** Update pagination info label */
	private updateCount(): void {
		const from = this.totalCount ? this.offset + 1 : 0;
		const to = Math.min(this.offset + this.limit, this.totalCount);
		this.countLabel = `Total Records: ${from} to ${to} of ${this.totalCount}`;
	}

	/** Handle paginator change */
	onPageSizeChange(event: PageEvent): void {
		this.limit = event.pageSize;
		this.offset = event.pageIndex * this.limit;

		// 🧠 Safety: reset offset if beyond total
		if (this.offset >= this.totalCount) {
			this.offset = 0;
		}

		this.getData(); // 🔥 Fetch server data again
		this.pageChanged.emit(event.pageIndex);

		// ✅ Update paginator state manually
		if (this.paginator) {
			this.paginator.pageIndex = event.pageIndex;
			this.paginator.length = this.totalCount;
			this.paginator.pageSize = this.limit;
		}
	}

	/** Handle action button click */
	handleAction(type: string, row: T): void {
		this.action.emit({ type, data: row });
	}

	/** Check if all rows are selected */
	isAllSelected(): boolean {
		return this.selection.selected.length === this.dataSource.data.length && this.dataSource.data.length > 0;
	}

	/** Toggle select/deselect all rows */
	masterToggle(): void {
		if (this.isAllSelected()) {
			this.selection.clear();
		} else {
			this.dataSource.data.forEach((row) => this.selection.select(row));
		}
		this.emitSelectedRows();
	}

	/** Toggle individual row selection */
	toggleRow(row: T): void {
		this.selection.toggle(row);
		this.emitSelectedRows();
	}

	/** Emit selected rows */
	private emitSelectedRows(): void {
		this.selectedRows.emit(this.selection.selected);
	}

	/** Returns list of column accessors */
	get columnAccessors(): string[] {
		const baseColumns = this.displayedColumns.map((col) => col.accessor.toString());
		// const hasSelect = baseColumns.includes("select");
		const hasActions = baseColumns.includes("actions");

		// Always show selection column first
		const finalColumns = ["select", ...baseColumns];

		// If you also want to automatically append "actions" at the end (common pattern)
		if (!hasActions) {
			finalColumns.push("actions");
		}

		return finalColumns;
	}

	private query = "";
}
