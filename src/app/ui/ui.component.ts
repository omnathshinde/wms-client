import { inject } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";

import { AuthService } from "@app/core/auth/auth.service";
import { CustomerService } from "@app/modules/services/customer.service";
import { InwardService } from "@app/modules/services/inward.service";
import { MaterialService } from "@app/modules/services/material.service";
import { PutawayService } from "@app/modules/services/putaway.service";
import { RackService } from "@app/modules/services/rack.service";
import { RoleService } from "@app/modules/services/role.service";
import { RoleAccessService } from "@app/modules/services/roleAccess.service";
import { ShelfService } from "@app/modules/services/shelf.service";
import { SiteService } from "@app/modules/services/site.service";
import { UserService } from "@app/modules/services/user.service";
import { ZoneService } from "@app/modules/services/zone.service";

export abstract class UiComponent {
	protected readonly fb = inject(FormBuilder);
	protected readonly toastr = inject(ToastrService);
	protected readonly matDialog = inject(MatDialog);

	// services and other common dependencies can be injected here and will be available to all components that extend UiComponent
	protected readonly authService = inject(AuthService);
	protected readonly userService = inject(UserService);
	protected readonly roleService = inject(RoleService);
	protected readonly roleAccessService = inject(RoleAccessService);
	protected readonly siteService = inject(SiteService);
	protected readonly zoneService = inject(ZoneService);
	protected readonly rackService = inject(RackService);
	protected readonly shelfService = inject(ShelfService);
	protected readonly materialService = inject(MaterialService);
	protected readonly customerService = inject(CustomerService);

	protected readonly inwardService = inject(InwardService);
	protected readonly putawayService = inject(PutawayService);
}
