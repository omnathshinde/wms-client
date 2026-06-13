import { Routes } from "@angular/router";

export const OutboundRoutes: Routes = [
	{
		path: "packing",
		loadComponent: () => import("src/app/modules/outbound/packing/packing").then((m) => m.Packing),
	},
	{
		path: "picking",
		loadComponent: () => import("src/app/modules/outbound/picking/picking").then((m) => m.Picking),
	},
	{
		path: "dispatch",
		loadComponent: () => import("src/app/modules/outbound/dispatch/dispatch").then((m) => m.Dispatch),
	},
	{
		path: "returns",
		loadComponent: () => import("src/app/modules/outbound/returns/returns").then((m) => m.Returns),
	},
	{ path: "**", redirectTo: "/dashboard", pathMatch: "full" },
];
