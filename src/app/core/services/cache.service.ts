import { HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class CacheService {
	private store = new Map<string, { data: HttpResponse<unknown>; expiry: number }>();

	/** Cache a response for a specific TTL (milliseconds). */
	set<T>(url: string, data: HttpResponse<T>, ttl: number): void {
		this.store.set(url, { data, expiry: Date.now() + ttl });
	}

	/** Retrieve a cached response if not expired. */
	get<T>(url: string): HttpResponse<T> | null {
		const cached = this.store.get(url);
		if (!cached) return null;

		if (cached.expiry < Date.now()) {
			this.store.delete(url);
			return null;
		}

		return cached.data as HttpResponse<T>;
	}

	/** Optional helpers */
	clear(): void {
		this.store.clear();
	}

	delete(url: string): void {
		this.store.delete(url);
	}
}
