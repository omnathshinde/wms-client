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

export interface TableColumn<T> {
	accessor: keyof T | string;
	label: string;
	date?: boolean;
	sortable?: boolean;
}

@Component({
	selector: "app-data-table-1",
	standalone: true,
	imports: [AppModule],
	templateUrl: "./data-table-1.html",
	styleUrl: "./data-table-1.scss",
})
export class DataTable1<T extends { id?: number | string }> implements OnInit, OnChanges {
	@Input() apiUrl = "";
	@Input() displayedColumns: { label: string; accessor: keyof T | string | "actions"; date?: boolean }[] = [];
	@Output() pageChanged = new EventEmitter<number>();
	@Input() reload = 0;

	limit = 5;
	offset = 0;
	totalCount = 0;
	countLabel = "Total Records: 0 to 0 of 0";
	pageSizeOptions = [5, 10, 50, 100];

	dataSource = new MatTableDataSource<T>([]);

	/** Internal injections */
	private readonly http = inject(HttpClient);
	private readonly serverUrl = inject(API_URL);
	private readonly toastr = inject(ToastrService);

	@ViewChild(MatPaginator) paginator!: MatPaginator;

	ngOnInit(): void {
		this.getData();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes["reload"] && !changes["reload"].firstChange) {
			this.getData();
		}
	}

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

	private updateCount(): void {
		const from = this.totalCount ? this.offset + 1 : 0;
		const to = Math.min(this.offset + this.limit, this.totalCount);
		this.countLabel = `Total Records: ${from} to ${to} of ${this.totalCount}`;
	}

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

	get columnAccessors(): string[] {
		return this.displayedColumns.map((col) => col.accessor.toString());
	}

	private buildQuery(): void {
		const params = new URLSearchParams({
			limit: this.limit.toString(),
			offset: this.offset.toString(),
		});

		this.query = `${this.serverUrl}/${this.apiUrl}?${params.toString()}`;
	}

	private query = "";
}
