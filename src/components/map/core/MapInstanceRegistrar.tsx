/**
 * MapInstanceRegistrar — Phase A (foundation)
 *
 * Drop this component as a child of a <MapContainer /> to register the
 * Leaflet map with `mapController` and emit move/zoom/ready events on
 * the global `mapEventBus`. Movement events are debounced (150ms) so we
 * don't flood subscribers like the mini-map or viewport-marker filter.
 *
 * Usage:
 *   <MapContainer ...>
 *     <MapInstanceRegistrar />
 *     ...
 *   </MapContainer>
 */

import { useEffect, useRef } from 'react';
import { useMap, useMapEvents } from 'react-leaflet';
import { mapController } from './MapController';
import { mapEventBus } from './mapEventBus';

const MOVE_DEBOUNCE_MS = 150;

const MapInstanceRegistrar = () => {
  const map = useMap();
  const moveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Register with controller
  useEffect(() => {
    mapController.register(map);
    mapEventBus.emit('map:ready', { center: map.getCenter(), zoom: map.getZoom() });
    return () => {
      mapController.unregister(map);
      if (moveTimer.current) clearTimeout(moveTimer.current);
    };
  }, [map]);

  // Wire Leaflet events → bus (debounced)
  useMapEvents({
    moveend: () => {
      if (moveTimer.current) clearTimeout(moveTimer.current);
      moveTimer.current = setTimeout(() => {
        mapEventBus.emit('map:move', {
          center: map.getCenter(),
          bounds: map.getBounds(),
          zoom: map.getZoom(),
        });
      }, MOVE_DEBOUNCE_MS);
    },
    zoomend: () => {
      mapEventBus.emit('map:zoom', { zoom: map.getZoom() });
    },
  });

  return null;
};

export default MapInstanceRegistrar;
