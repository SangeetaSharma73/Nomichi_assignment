import { format } from "date-fns";

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatTripDates(start: string, end: string) {
  return `${format(new Date(`${start}T00:00:00`), "d MMM")} to ${format(
    new Date(`${end}T00:00:00`),
    "d MMM yyyy",
  )}`;
}

export function formatDateTime(value: string) {
  return format(new Date(value), "d MMM yyyy, h:mm a");
}
