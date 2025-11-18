import { Component, Input } from "@angular/core";

@Component({
	selector: "app-form-section",
	imports: [],
	templateUrl: "./form-section.html",
	styleUrl: "./form-section.scss",
})
export class FormSection {
	@Input() title!: string;
}
