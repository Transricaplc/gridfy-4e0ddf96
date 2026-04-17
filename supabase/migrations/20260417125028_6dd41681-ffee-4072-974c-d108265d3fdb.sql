-- 1. Restrict CCTV camera locations to authenticated staff only
-- Public access exposed surveillance blind spots and operational gaps.
DROP POLICY IF EXISTS "Anyone can read CCTV assets" ON public.cctv_assets;

CREATE POLICY "Staff can read CCTV assets"
ON public.cctv_assets
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR has_role(auth.uid(), 'dispatcher'::app_role)
);

-- 2. Citizen reports: enum-style CHECK constraints to prevent arbitrary input
ALTER TABLE public.citizen_reports
  DROP CONSTRAINT IF EXISTS report_type_valid;
ALTER TABLE public.citizen_reports
  ADD CONSTRAINT report_type_valid
  CHECK (report_type IN ('crime','accident','fire','water_spill','infrastructure','medical','suspicious','other'));

ALTER TABLE public.citizen_reports
  DROP CONSTRAINT IF EXISTS infrastructure_type_valid;
ALTER TABLE public.citizen_reports
  ADD CONSTRAINT infrastructure_type_valid
  CHECK (
    infrastructure_type IS NULL
    OR infrastructure_type IN ('pothole','streetlight','illegal_dumping','graffiti','broken_sidewalk','water_leak','traffic_signal','other')
  );
