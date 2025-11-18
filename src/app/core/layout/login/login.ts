import { Component, inject, signal } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

import { AuthService } from "src/app/core/auth/auth.service";
import { AppModule } from "src/app/core/configs/app.module";
import { ApiState } from "src/app/interfaces/common/ApiState";

interface LoginPayload {
	username: string;
	password: string;
}

@Component({
	selector: "app-login",
	imports: [...AppModule],
	templateUrl: "./login.html",
	styleUrl: "./login.scss",
})
export class LoginPage {
	hidePassword = signal(true);

	private fb = inject(FormBuilder);
	private toastr = inject(ToastrService);
	private auth = inject(AuthService);
	private router = inject(Router);

	readonly state = signal<ApiState<unknown>>({
		data: null,
		loading: false,
		error: null,
	});

	loginForm = this.fb.nonNullable.group({
		username: ["", [Validators.required]],
		password: ["", [Validators.required]],
	});

	get username() {
		return this.loginForm.controls.username;
	}

	get password() {
		return this.loginForm.controls.password;
	}

	togglePasswordVisibility() {
		this.hidePassword.update((v) => !v);
	}

	onSubmit(): void {
		if (this.loginForm.invalid || this.state().loading) return;

		this.state.update((s) => ({ ...s, loading: true, error: null }));

		const payload: LoginPayload = this.loginForm.getRawValue();

		this.auth.login(payload).subscribe({
			next: (res) => {
				this.state.set({ data: res, loading: false, error: null });
				this.router.navigateByUrl("/");
			},
			error: (err) => {
				this.state.set({ data: null, loading: false, error: err });
			},
		});
	}

	onForgotPassword(): void {
		const msg = "Please contact Administrator to reset your password";
		this.toastr.info(msg);
	}
}
