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
	{ path: "**", redirectTo: "/", pathMatch: "full" },
];
