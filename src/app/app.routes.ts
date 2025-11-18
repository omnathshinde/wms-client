import { Routes } from "@angular/router";

import { AuthGuard } from "src/app/core/auth/auth.guard";
import { Home } from "src/app/core/layout/root/home/home";

export const routes: Routes = [
	{
		path: "login",
		canActivate: [AuthGuard],
		loadComponent: () => import("src/app/core/layout/login/login").then((m) => m.LoginPage),
	},

	{
		path: "",
		component: Home,
		canActivate: [AuthGuard],
		canActivateChild: [AuthGuard],
		children: [
			{
				path: "",
				loadComponent: () => import("src/app/core/layout/dashboard/dashboard").then((m) => m.Dashboard),
			},
			{
				path: "masters",
				loadChildren: () => import("src/app/modules/main/main.routes").then((m) => m.MainRoutes),
			},
			{
				path: "reports",
				loadChildren: () => import("src/app/modules/reports/reports.routes").then((m) => m.ReportsRoutes),
			},
		],
	},

	{ path: "**", redirectTo: "" },
];
