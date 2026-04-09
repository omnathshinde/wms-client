import { Routes } from "@angular/router";

import { Home } from "@core/layout/root/home/home";

export const routes: Routes = [
	{
		path: "",
		component: Home,
		children: [
			{
				path: "",
				loadComponent: () => import("src/app/core/layout/dashboard/dashboard").then((m) => m.Dashboard),
			},
		],
	},
];
