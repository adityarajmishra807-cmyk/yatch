/*
# Create meridian_enquiries table (single-tenant, no auth)

1. New Tables
- `meridian_enquiries`
- `id` (uuid, primary key)
- `name` (text, not null)
- `phone` (text, not null)
- `email` (text, not null)
- `preferred_date` (date, nullable)
- `guests` (text, nullable)
- `occasion` (text, nullable)
- `message` (text, nullable)
- `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `meridian_enquiries`.
- Allow anon + authenticated INSERT only (public enquiry form).
- No SELECT/UPDATE/DELETE from the client — enquiries are private to the operator.
*/

CREATE TABLE IF NOT EXISTS meridian_enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  preferred_date date,
  guests text,
  occasion text,
  message text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE meridian_enquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_enquiries" ON meridian_enquiries;
CREATE POLICY "anon_insert_enquiries" ON meridian_enquiries
  FOR INSERT TO anon, authenticated WITH CHECK (true);
