import { Routes } from "@angular/router";

import { Home } from "@core/layout/root/home/home";

export const routes: Routes = [
	{
		path: "",
		component: Home,
		children: [
			{ path: "", redirectTo: "/dashboard", pathMatch: "full" },
			{
				path: "dashboard",
				loadComponent: () => import("src/app/core/layout/dashboard/dashboard").then((m) => m.Dashboard),
			},
			{
				path: "masters",
				loadChildren: () => import("src/app/modules/main/main.routes").then((m) => m.MainRoutes),
			},
			{
				path: "transactions",
				loadChildren: () => import("src/app/modules/pages/pages.routes").then((m) => m.PagesRoutes),
			},
			{
				path: "reports",
				loadChildren: () => import("src/app/modules/reports/reports.routes").then((m) => m.ReportsRoutes),
			},
		],
	},
];
