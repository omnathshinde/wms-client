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
				access: "User",
			},
			{
				title: "Role",
				icon: "badge",
				route: "/masters/role",
				access: "Role",
			},
		],
	},
	{
		title: "Inward",
		icon: "move_to_inbox",
		route: "transactions/inward",
		access: "User",
	},
	{
		title: "QC",
		icon: "fact_check",
		route: "transactions/quality-check",
		access: "QC",
	},
	{
		title: "Putaway",
		icon: "inventory_2",
		route: "transactions/putaway",
		access: "Role",
	},
	{
		title: "Reports",
		icon: "analytics",
		children: [
			{
				title: "Inward",
				icon: "summarize",
				route: "/reports/inward",
				access: "Inward",
			},
			{
				title: "QC",
				icon: "rule",
				route: "/reports/quality-check",
				access: "QC",
			},
		],
	},
];
