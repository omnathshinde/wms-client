import { computed, Injectable, Signal, signal, WritableSignal } from "@angular/core";

@Injectable({ providedIn: "root" })
export class StateService {
	private readonly _activeRequests: WritableSignal<number> = signal(0);
	private readonly _error: WritableSignal<string | null> = signal(null);

	readonly loading: Signal<boolean> = computed(() => this._activeRequests() > 0);
	readonly error: Signal<string | null> = this._error.asReadonly();

	beginRequest(): void {
		this._activeRequests.update((v) => v + 1);
	}
	endRequest(): void {
		this._activeRequests.update((v) => Math.max(0, v - 1));
	}
	setError(message: string | null): void {
		this._error.set(message);
	}
	clearError(): void {
		this._error.set(null);
	}
}
