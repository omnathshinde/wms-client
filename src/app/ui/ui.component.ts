import { inject } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";

import { RoleService } from "@app/modules/services/role.service";
import { UserService } from "@app/modules/services/user.service";

export abstract class UiComponent {
	protected readonly fb = inject(FormBuilder);
	protected readonly toastr = inject(ToastrService);
	protected readonly matDialog = inject(MatDialog);

	// services and other common dependencies can be injected here and will be available to all components that extend UiComponent
	protected readonly userService = inject(UserService);
	protected readonly roleService = inject(RoleService);
}
