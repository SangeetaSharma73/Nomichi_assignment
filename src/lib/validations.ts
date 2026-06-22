import { z } from "zod";

const phone = z
  .string()
  .trim()
  .transform((value) => value.replace(/\D/g, ""))
  .pipe(z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian phone number"));

export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Tell us your name").max(80),
  phone,
  email: z.string().trim().email("Enter a valid email address").max(160),
  trip_id: z.string().uuid("Choose a trip"),
  group_type: z.enum(["solo", "friends", "couple", "family"]),
  preferred_month: z.string().regex(/^\d{4}-\d{2}$/, "Choose a preferred month"),
  expectation: z.string().trim().max(1000).optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const noteSchema = z.object({
  lead_id: z.string().uuid(),
  note: z.string().trim().min(2, "Add a useful note").max(3000),
  next_action: z.string().trim().max(500).optional(),
});

export const tripSchema = z
  .object({
    id: z.string().uuid().optional(),
    name: z.string().trim().min(2).max(120),
    destination: z.string().trim().min(2).max(120),
    start_date: z.string().date(),
    end_date: z.string().date(),
    price_gst: z.coerce.number().positive().max(10000000),
    total_seats: z.coerce.number().int().positive().max(1000),
    status: z.enum(["OPEN", "CLOSED"]),
    description: z.string().trim().min(10).max(500),
  })
  .refine((data) => data.end_date >= data.start_date, {
    message: "End date must be on or after the start date",
    path: ["end_date"],
  });
