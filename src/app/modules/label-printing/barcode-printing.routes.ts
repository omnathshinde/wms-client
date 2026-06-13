import { Routes } from "@angular/router";

export const BarcodePrintingRoutes: Routes = [
	{
		path: "location",
		loadComponent: () =>
			import("src/app/modules/label-printing/label-location/label-location").then((m) => m.LabelLocation),
	},
	{
		path: "material",
		loadComponent: () =>
			import("src/app/modules/label-printing/label-material/label-material").then((m) => m.LabelMaterial),
	},
	{ path: "**", redirectTo: "/dashboard", pathMatch: "full" },
];
