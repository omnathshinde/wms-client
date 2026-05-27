import { Routes } from "@angular/router";

import { AuthGuard } from "@core/auth/auth.guard";
import { LoginGuard } from "@core/guards/login.guard";
import { Home } from "@core/layout/root/home/home";

export const routes: Routes = [
	{
		path: "login",
		canActivate: [LoginGuard],
		loadComponent: () => import("@core/layout/login/login").then((m) => m.Login),
	},
	{
		path: "",
		component: Home,
		canActivate: [AuthGuard],
		canActivateChild: [AuthGuard],
		children: [
			{ path: "", redirectTo: "dashboard", pathMatch: "full" },
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
	{ path: "**", redirectTo: "dashboard" },
];
