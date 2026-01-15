-- Add CHECK constraints for input validation on citizen_reports table

-- Validate latitude is within valid geographic range
ALTER TABLE public.citizen_reports
ADD CONSTRAINT valid_latitude 
CHECK (latitude IS NULL OR (latitude >= -90 AND latitude <= 90));

-- Validate longitude is within valid geographic range
ALTER TABLE public.citizen_reports
ADD CONSTRAINT valid_longitude
CHECK (longitude IS NULL OR (longitude >= -180 AND longitude <= 180));

-- Limit description length to prevent storage abuse
ALTER TABLE public.citizen_reports
ADD CONSTRAINT description_length 
CHECK (description IS NULL OR length(description) <= 2000);

-- Limit report_type length
ALTER TABLE public.citizen_reports
ADD CONSTRAINT report_type_length 
CHECK (length(report_type) <= 100);

-- Limit infrastructure_type length
ALTER TABLE public.citizen_reports
ADD CONSTRAINT infrastructure_type_length 
CHECK (infrastructure_type IS NULL OR length(infrastructure_type) <= 100);