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
	selector: "app-data-table-2",
	imports: [AppModule],
	templateUrl: "./data-table-2.html",
	styleUrl: "./data-table-2.scss",
})
export class DataTable2<T extends { id?: number | string }> implements OnInit, OnChanges {
	// Inputs & Outputsj
	@Input() apiUrl = "";
	@Input() displayedColumns: {
		label: string;
		accessor: keyof T | ((row: T) => unknown) | "actions";
		date?: boolean;
	}[] = [];
	@Input() actionButtons: {
		icon: string;
		type: string;
		tooltip?: string;
		color?: string;
		disabled?: (row: T) => boolean;
		visible?: (row: T) => boolean;
	}[] = [];
	@Input() filterFields: Partial<Record<keyof T, string | number | boolean>> = {};

	@Output() action = new EventEmitter<{ type: string; data: T }>();
	@Output() pageChanged = new EventEmitter<number>();

	// Table & Pagination State
	query = "";
	limit = 5;
	offset = 0;
	totalCount = 0;
	countLabel = "Total Records: 0 to 0 of 0";
	pageSizeOptions = [5, 10, 50, 100];
	dataSource = new MatTableDataSource<T>([]);

	// services
	private readonly http = inject(HttpClient);
	private readonly toastr = inject(ToastrService);
	private readonly serverUrl = inject(API_URL);

	@ViewChild(MatPaginator) paginator!: MatPaginator;

	ngOnInit(): void {
		this.getData();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes["filterFields"] && !changes["filterFields"].firstChange) {
			this.offset = 0;
			this.getData();
		}
	}

	get columnAccessors(): string[] {
		const baseColumns = this.displayedColumns.map((col) => col.accessor.toString());
		const hasActions = baseColumns.includes("actions");
		const finalColumns = [...baseColumns];
		if (!hasActions) {
			finalColumns.push("actions");
		}
		return finalColumns;
	}

	getData(): void {
		this.buildQuery();

		this.http.get<ApiResponse<T>>(this.query).subscribe({
			next: (res) => {
				if (!res?.rows?.length) {
					this.dataSource.data = [];
					this.totalCount = 0;
					this.toastr.warning("No data found");
					return;
				}

				this.dataSource.data = res.rows;
				this.totalCount = res.count || res.rows.length;
				if (this.paginator) {
					this.paginator.length = this.totalCount;
					this.paginator.pageIndex = this.offset / this.limit;
				}
			},
		});
	}

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

	onPageSizeChange(event: PageEvent): void {
		this.limit = event.pageSize;
		this.offset = event.pageIndex * this.limit;

		if (this.offset >= this.totalCount) {
			this.offset = 0;
		}

		this.getData();
		this.pageChanged.emit(event.pageIndex);

		if (this.paginator) {
			this.paginator.pageIndex = event.pageIndex;
			this.paginator.length = this.totalCount;
			this.paginator.pageSize = this.limit;
		}
	}

	handleAction(type: string, row: T): void {
		this.action.emit({ type, data: row });
	}
}
