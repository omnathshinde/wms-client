import { NavItem } from "src/app/interfaces/common/NavItem";

export const AppNavigation: NavItem[] = [
	{
		title: "Dashboard",
		icon: "dashboard",
		route: "/",
		access: "Dashboard",
		match: true,
	},
	{
		title: "Masters",
		icon: "settings",
		children: [
			{
				title: "User",
				icon: "person",
				route: "/masters/user",
				access: "User",
			},
			{
				title: "Role",
				icon: "security",
				route: "/masters/role",
				access: "Role",
			},
		],
	},
	{
		title: "Inward",
		icon: "inbox",
		route: "/masters/inward",
		access: "User",
	},
	{
		title: "Putaway",
		icon: "inventory",
		route: "/masters/putaway",
		access: "Role",
	},
];
