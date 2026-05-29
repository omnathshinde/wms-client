import { NavItem } from "src/app/interfaces/common/NavItem";

export const AppNavigation: NavItem[] = [
	{
		title: "Dashboard",
		icon: "dashboard",
		route: "/dashboard",
		access: "Dashboard",
		match: true,
	},
	{
		title: "Masters",
		icon: "admin_panel_settings",
		children: [
			{
				title: "User",
				icon: "person",
				route: "/masters/user",
				access: "User Master",
			},
			{
				title: "Role",
				icon: "badge",
				route: "/masters/role",
				access: "Role Master",
			},
			{
				title: "Material",
				icon: "inventory",
				route: "/masters/material",
				access: "Material Master",
			},
			{
				title: "Customer",
				icon: "people",
				route: "/masters/customer",
				access: "Customer Master",
			},
			{
				title: "Site",
				icon: "warehouse",
				route: "/masters/site",
				access: "Site Master",
			},
			{
				title: "Zone",
				icon: "grid_view",
				route: "/masters/zone",
				access: "Zone Master",
			},
			{
				title: "Rack",
				icon: "storage",
				route: "/masters/rack",
				access: "Rack Master",
			},
			{
				title: "Shelf",
				icon: "shelves",
				route: "/masters/shelf",
				access: "Shelf Master",
			},
		],
	},
	{
		title: "Inward",
		icon: "move_to_inbox",
		route: "transactions/inward",
		access: "Inward Details",
	},
	{
		title: "QC",
		icon: "fact_check",
		route: "transactions/quality-check",
		access: "QC Details",
	},
	{
		title: "Putaway",
		icon: "inventory_2",
		route: "transactions/putaway",
		access: "Putaway Details",
	},
	{
		title: "Reports",
		icon: "analytics",
		children: [
			{
				title: "Inward",
				icon: "summarize",
				route: "/reports/inward",
				access: "Inward Details",
			},
			{
				title: "QC",
				icon: "rule",
				route: "/reports/quality-check",
				access: "QC Details",
			},
		],
	},
];
