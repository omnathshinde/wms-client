import { Routes } from "@angular/router";

export const PagesRoutes: Routes = [
	{
		path: "inward",
		loadComponent: () => import("src/app/modules/pages/inward/inward").then((m) => m.Inward),
	},
	{
		path: "quality-check",
		loadComponent: () => import("src/app/modules/pages/qc/qc").then((m) => m.Qc),
	},
	{
		path: "putaway",
		loadComponent: () => import("src/app/modules/pages/putaway/putaway").then((m) => m.Putaway),
	},
	{ path: "**", redirectTo: "/dashboard", pathMatch: "full" },
];
