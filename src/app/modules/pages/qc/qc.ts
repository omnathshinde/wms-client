import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";

import { InwardDTO } from "src/app/@types/models/InwardDTO";
import { AppComponent } from "src/app/core/configs/app.component";
import { AppModule } from "src/app/core/configs/app.module";
import { UiComponent } from "src/app/ui/ui.component";

import { QcDialog } from "./qc-dialog/qc-dialog";

@Component({
	selector: "app-qc",
	imports: [AppModule, AppComponent],
	templateUrl: "./qc.html",
	styleUrl: "./qc.scss",
})
export class Qc extends UiComponent implements OnInit {
	apiUrl = "inward/search/records";
	displayedColumns = [
		{ label: "Barcode", accessor: "barcode" as const },
		{ label: "Material", accessor: (row: InwardDTO) => row.material?.name ?? "-" },
		{ label: "QC Status", accessor: "qcStatus" as const },
		{ label: "Created At", accessor: "createdAt" as const, date: true },
		{ label: "Created By", accessor: "createdBy" as const },
	];

	actionButtons = [
		{
			type: "approve",
			icon: "verified",
			tooltip: "Approve QC",
			color: "primary",
			visible: (row: InwardDTO) => row.qcStatus === "Pending" || row.qcStatus === "Rejected",
		},
		{
			type: "reject",
			icon: "cancel",
			tooltip: "Reject QC",
			color: "warn",
			visible: (row: InwardDTO) => row.qcStatus === "Pending" || row.qcStatus === "Approved",
		},
	];

	filterFields: Partial<Record<keyof InwardDTO, string | number | boolean>> = {
		status: 1,
		isPutAway: 0,
		barcode: "",
		qcStatus: "",
	};

	searchForm: FormGroup = this.fb.group({
		barcode: [""],
		qcStatus: [""],
	});

	ngOnInit(): void {
		this.searchForm.valueChanges.subscribe(() => {
			this.onSearch();
		});
	}

	onSearch(): void {
		const formValue = this.searchForm.value;

		this.filterFields = {
			status: 1,
			isPutAway: 0,
			barcode: formValue.barcode || "",
			qcStatus: formValue.qcStatus || "",
		};
	}

	onReset(): void {
		this.searchForm.reset({
			barcode: "",
			qcStatus: "",
		});

		this.filterFields = { status: 1, isPutAway: 0, barcode: "", qcStatus: "" };
	}

	onAction(event: { type: string; data: InwardDTO }): void {
		switch (event.type) {
			case "reject":
				this.onReject(event.data);
				break;
			case "approve":
				this.onApprove(event.data);
				break;
			default:
				this.toastr.error("Unknown action");
		}
	}

	onApprove(data: InwardDTO): void {
		this.openQcDialog(data, "Approved");
	}

	onReject(data: InwardDTO): void {
		this.openQcDialog(data, "Rejected");
	}

	openQcDialog(data: InwardDTO, qcStatus: "Approved" | "Rejected"): void {
		const dialogRef = this.matDialog.open(QcDialog, {
			minWidth: "40%",
			data: {
				barcode: data.barcode,
				inwardId: data.id,
				qcStatus,
			},
		});

		dialogRef.afterClosed().subscribe((remark) => {
			if (!remark) return;

			this.qcService
				.create({
					inwardId: data.id,
					qcStatus,
					remark,
				})
				.subscribe((res) => {
					this.toastr.success(res.message);
					this.onSearch();
				});
		});
	}
}
