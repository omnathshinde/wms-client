import { NavItem } from "src/app/@types/common/NavItem";

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
		title: "Label Printing",
		icon: "qr_code",
		children: [
			{
				title: "Location",
				icon: "location_on",
				route: "/label-printing/location",
				access: "Inward Details",
			},
			{
				title: "Material",
				icon: "inventory_2",
				route: "/label-printing/material",
				access: "Inward Details",
			},
		],
	},
	{
		title: "Inbound",
		icon: "call_received",
		children: [
			{
				title: "Inward",
				icon: "move_to_inbox",
				route: "/inbound/inward",
				access: "Inward Details",
			},
			{
				title: "QC",
				icon: "fact_check",
				route: "/inbound/quality-check",
				access: "QC Details",
			},
			{
				title: "Putaway",
				icon: "inventory_2",
				route: "/inbound/putaway",
				access: "Putaway Details",
			},
		],
	},
	{
		title: "Outbound",
		icon: "call_made",
		children: [
			{
				title: "Picking",
				icon: "add_shopping_cart",
				route: "/outbound/picking",
				access: "Picking Details",
			},
			{
				title: "Packing",
				icon: "all_inbox",
				route: "/outbound/packing",
				access: "Picking Details",
			},
			{
				title: "Dispatch",
				icon: "departure_board",
				route: "/outbound/dispatch",
				access: "Picking Details",
			},
			{
				title: "Returns",
				icon: "assignment_return",
				route: "/outbound/returns",
				access: "Picking Details",
			},
		],
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
