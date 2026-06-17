import { inject } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";

import { AuthService } from "src/app/core/auth/auth.service";
import { CustomerService } from "src/app/modules/services/customer.service";
import { InwardService } from "src/app/modules/services/inward.service";
import { MaterialService } from "src/app/modules/services/material.service";
import { PicklistService } from "src/app/modules/services/picklist.service";
import { PicklistItemService } from "src/app/modules/services/picklistItem.service";
import { PicklistItemBarcodeService } from "src/app/modules/services/picklistItemBarcode.service";
import { PicklistPickerService } from "src/app/modules/services/picklistPicker.service";
import { PutawayService } from "src/app/modules/services/putaway.service";
import { QcService } from "src/app/modules/services/qc.service";
import { RackService } from "src/app/modules/services/rack.service";
import { RoleService } from "src/app/modules/services/role.service";
import { RoleAccessService } from "src/app/modules/services/roleAccess.service";
import { ShelfService } from "src/app/modules/services/shelf.service";
import { SiteService } from "src/app/modules/services/site.service";
import { UserService } from "src/app/modules/services/user.service";
import { ZoneService } from "src/app/modules/services/zone.service";

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
	protected readonly qcService = inject(QcService);
	protected readonly putawayService = inject(PutawayService);

	protected readonly picklistService = inject(PicklistService);
	protected readonly picklistPickerService = inject(PicklistPickerService);
	protected readonly picklistItemService = inject(PicklistItemService);
	protected readonly picklistItemBarcodeService = inject(PicklistItemBarcodeService);
}
