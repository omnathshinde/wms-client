export interface CacheRoute {
	prefix: string;
	ttl: number;
}

export const CACHE_ROUTES: CacheRoute[] = [
	{ prefix: "/material", ttl: 10 * 1000 },
	{ prefix: "/role", ttl: 10 * 1000 },
	{ prefix: "/user", ttl: 10 * 1000 },
	{ prefix: "/site", ttl: 10 * 1000 },
	{ prefix: "/shelf", ttl: 10 * 1000 },
	{ prefix: "/uom", ttl: 10 * 1000 },
];
