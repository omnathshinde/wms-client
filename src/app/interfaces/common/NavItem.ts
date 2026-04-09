export interface NavItem {
	title: string;
	icon: string;
	route?: string;
	access?: string;
	match?: boolean;
	children?: NavItem[] | null;
}
