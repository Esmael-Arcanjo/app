export type Base = { id: string; organization_id: string; created_at: string; updated_at: string; version: number };
export type Lead = Base & {
  name: string; email: string | null; phone: string | null; company: string | null; source: string | null;
  status: "new" | "contacted" | "qualified" | "lost" | "converted"; value_cents: number; notes: string | null;
  custom_fields: Record<string, string | number | boolean | null>;
};
export type Contact = Base & { name: string; email: string | null; phone: string | null; company: string | null; position: string | null; notes: string | null; tags: string[] };
export type Opportunity = Base & { title: string; contact_id: string | null; value_cents: number; stage_key: string; status: "open" | "won" | "lost"; expected_close_date: string | null; notes: string | null };
export type Activity = Base & { type: "call" | "email" | "meeting" | "task" | "note"; subject: string; description: string | null; due_at: string | null; done: boolean; related_type: string | null; related_id: string | null };
export type Stage = { key: string; name: string; probability: number };
export type Pipeline = Base & { name: string; segment: string; stages: Stage[] };
export type SegmentField = { key: string; label: string; type: "text" | "number" | "date" };
export type SegmentConfig = { segment: string; lead_fields: SegmentField[]; stages: Stage[]; sources: string[] };
export type Overview = {
  leads_total: number; leads_by_status: Record<string, number>; contacts_total: number; open_opportunities: number;
  open_value_cents: number; weighted_value_cents: number; won_count: number; won_value_cents: number; pending_activities: number;
  stages: { key: string; name: string; count: number; value_cents: number }[];
  upcoming_activities: { id: string; subject: string; type: string; due_at: string | null }[];
};
