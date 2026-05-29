import { Routes } from "@angular/router";

import { AccessGuard } from "src/app/core/guards/access.guard";

export const MainRoutes: Routes = [
	{
		path: "role",
		canActivate: [AccessGuard],
		data: { access: "User Master" },
		loadComponent: () => import("src/app/modules/main/role/role").then((m) => m.Role),
	},
	{
		path: "user",
		canActivate: [AccessGuard],
		data: { access: "User Master" },
		loadComponent: () => import("src/app/modules/main/user/user").then((m) => m.User),
	},
	{
		path: "site",
		canActivate: [AccessGuard],
		data: { access: "Site Master" },
		loadComponent: () => import("src/app/modules/main/site/site").then((m) => m.Site),
	},
	{
		path: "zone",
		canActivate: [AccessGuard],
		data: { access: "Zone Master" },
		loadComponent: () => import("src/app/modules/main/zone/zone").then((m) => m.Zone),
	},
	{
		path: "rack",
		canActivate: [AccessGuard],
		data: { access: "Rack Master" },
		loadComponent: () => import("src/app/modules/main/rack/rack").then((m) => m.Rack),
	},
	{
		path: "shelf",
		canActivate: [AccessGuard],
		data: { access: "Shelf Master" },
		loadComponent: () => import("src/app/modules/main/shelf/shelf").then((m) => m.Shelf),
	},
	{
		path: "material",
		canActivate: [AccessGuard],
		data: { access: "Material Master" },
		loadComponent: () => import("src/app/modules/main/material/material").then((m) => m.Material),
	},
	{
		path: "customer",
		canActivate: [AccessGuard],
		data: { access: "Customer Master" },
		loadComponent: () => import("src/app/modules/main/customer/customer").then((m) => m.Customer),
	},
	{ path: "**", redirectTo: "/", pathMatch: "full" },
];
