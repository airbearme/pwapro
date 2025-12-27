-- Add version function for health checks
-- This function is called by the health check endpoint to verify database connectivity

CREATE OR REPLACE FUNCTION public.version()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN 'AirBear PWA v2.0.0 - Database Schema Version 1.0.0';
END;
$$;