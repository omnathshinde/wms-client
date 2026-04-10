import { Routes } from "@angular/router";

export const ReportsRoutes: Routes = [
	{
		path: "inward",
		loadComponent: () => import("src/app/modules/reports/inward/inward").then((m) => m.Inward),
	},
	{
		path: "quality-check",
		loadComponent: () => import("src/app/modules/reports/qc/qc").then((m) => m.Qc),
	},
	{ path: "**", redirectTo: "/dashboard", pathMatch: "full" },
];
