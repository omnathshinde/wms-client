import { Routes } from "@angular/router";

export const MainRoutes: Routes = [
	{
		path: "role",
		loadComponent: () => import("src/app/modules/main/role/role").then((m) => m.Role),
	},
	{
		path: "user",
		loadComponent: () => import("src/app/modules/main/user/user").then((m) => m.User),
	},
	{
		path: "site",
		loadComponent: () => import("src/app/modules/main/site/site").then((m) => m.Site),
	},
	{
		path: "material",
		loadComponent: () => import("src/app/modules/main/material/material").then((m) => m.Material),
	},
	{
		path: "customer",
		loadComponent: () => import("src/app/modules/main/customer/customer").then((m) => m.Customer),
	},
	{ path: "**", redirectTo: "/", pathMatch: "full" },
];
