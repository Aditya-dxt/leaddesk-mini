-- Create the leads table
CREATE TABLE IF NOT EXISTS public.leads (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    email text NOT NULL,
    budget_range text NOT NULL,
    message text,
    status text NOT NULL DEFAULT 'New',
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Add check constraint for budget_range
ALTER TABLE public.leads 
    ADD CONSTRAINT check_budget_range 
    CHECK (budget_range IN ('<$1k', '$1k-5k', '$5k-20k', '$20k+'));

-- Add check constraint for status
ALTER TABLE public.leads 
    ADD CONSTRAINT check_status 
    CHECK (status IN ('New', 'Contacted', 'Closed'));

-- Enable Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Allow unauthenticated users (anyone) to insert leads
CREATE POLICY "Allow public insert on leads"
    ON public.leads FOR INSERT
    WITH CHECK (true);

-- Allow authenticated users to view leads
CREATE POLICY "Allow authenticated to select leads"
    ON public.leads FOR SELECT
    TO authenticated
    USING (true);

-- Allow authenticated users to update leads
CREATE POLICY "Allow authenticated to update leads"
    ON public.leads FOR UPDATE
    TO authenticated
    USING (true);
