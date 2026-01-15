-- Create running routes table
CREATE TABLE public.running_routes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  distance_km NUMERIC NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'moderate',
  terrain TEXT NOT NULL DEFAULT 'mixed',
  is_lit BOOLEAN DEFAULT false,
  has_water_stations BOOLEAN DEFAULT false,
  is_open BOOLEAN DEFAULT true,
  safety_rating INTEGER DEFAULT 3,
  coordinates_lat NUMERIC NULL,
  coordinates_lng NUMERIC NULL,
  notes TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.running_routes ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Running routes are publicly readable"
ON public.running_routes
FOR SELECT
USING (true);

-- Insert sample Cape Town running routes
INSERT INTO public.running_routes (name, location, distance_km, difficulty, terrain, is_lit, has_water_stations, safety_rating, notes) VALUES
('Sea Point Promenade', 'Sea Point', 7.0, 'easy', 'paved', true, true, 5, 'Popular flat route along the Atlantic. Well-lit, 24/7 security patrols.'),
('Green Point Urban Park', 'Green Point', 3.5, 'easy', 'paved', true, true, 5, 'Family-friendly park loop with water fountains and restrooms.'),
('Newlands Forest Loop', 'Newlands', 5.2, 'moderate', 'trail', false, false, 3, 'Shaded forest trails. Morning runs recommended.'),
('Rhodes Memorial Circuit', 'Rondebosch', 4.8, 'moderate', 'mixed', false, false, 3, 'Scenic views of Cape Town. Run in groups.'),
('Constantia Greenbelt', 'Constantia', 8.5, 'moderate', 'trail', false, true, 4, 'Wine farm adjacent trails. Security presence.'),
('Table Bay Boulevard', 'Foreshore', 4.0, 'easy', 'paved', true, false, 4, 'Urban route along the harbour.'),
('Deer Park Loop', 'Vredehoek', 3.2, 'difficult', 'trail', false, false, 3, 'Steep inclines with city views.'),
('Camps Bay Beach Run', 'Camps Bay', 2.5, 'easy', 'sand', false, false, 4, 'Beach running at sunrise/sunset recommended.'),
('Tokai Forest Trail', 'Tokai', 10.0, 'difficult', 'trail', false, true, 3, 'MTB shared trail. Watch for cyclists.'),
('V&A Waterfront Circuit', 'V&A Waterfront', 3.0, 'easy', 'paved', true, true, 5, 'Safe, scenic harbour route. 24/7 security.');