export type UserRole = "admin" | "associate";
export type TripStatus = "OPEN" | "CLOSED";
export type LeadStatus =
  | "NEW"
  | "CONTACTED"
  | "QUALIFIED"
  | "VIBE_CHECK"
  | "SENT"
  | "CONFIRMED"
  | "NOT_A_FIT";
export type GroupType = "solo" | "friends" | "couple" | "family";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
}

export interface Trip {
  id: string;
  name: string;
  destination: string;
  start_date: string;
  end_date: string;
  price_gst: number;
  total_seats: number;
  status: TripStatus;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  trip_id: string;
  group_type: GroupType;
  preferred_month: string;
  expectation: string | null;
  status: LeadStatus;
  owner_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeadNote {
  id: string;
  lead_id: string;
  note: string;
  next_action: string | null;
  created_by: string;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  lead_id: string;
  action: string;
  actor_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface LeadWithRelations extends Lead {
  trip: Pick<Trip, "id" | "name" | "destination"> | null;
  owner: Pick<Profile, "id" | "full_name" | "email"> | null;
}
