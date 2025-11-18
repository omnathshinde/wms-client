import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: "dateFormat",
})
export class DateFormatPipe implements PipeTransform {
	transform(value: string | number | Date | null | undefined): string {
		if (value === null || value === undefined) return "";

		const date = new Date(value);
		if (isNaN(date.getTime())) return String(value);

		const day = String(date.getDate()).padStart(2, "0");
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const year = date.getFullYear();

		const hours = date.getHours();
		const minutes = String(date.getMinutes()).padStart(2, "0");
		const seconds = String(date.getSeconds()).padStart(2, "0");

		const ampm = hours >= 12 ? "PM" : "AM";
		const hours12 = hours % 12 === 0 ? 12 : hours % 12;

		return `${day}-${month}-${year} ${String(hours12).padStart(2, "0")}:${minutes}:${seconds} ${ampm}`;
	}
}
