/**
 * useViewportMarkers — Phase A (foundation)
 *
 * Returns only the markers whose coordinates fall inside the current
 * map viewport. Subscribes to the debounced `map:move` event from the
 * map event bus so we re-filter at most every ~150ms.
 *
 * Falls back to all markers when no map is registered yet (initial render).
 */

import { useEffect, useState } from 'react';
import type { LatLngBounds } from 'leaflet';
import { mapController } from '@/components/map/core/MapController';
import { mapEventBus } from '@/components/map/core/mapEventBus';

export interface MarkerLike {
  lat: number;
  lng: number;
}

export function useViewportMarkers<T extends MarkerLike>(markers: T[]): T[] {
  const [bounds, setBounds] = useState<LatLngBounds | null>(() => {
    return mapController.getMap()?.getBounds() ?? null;
  });

  useEffect(() => {
    const offMove = mapEventBus.on('map:move', ({ bounds }) => setBounds(bounds));
    const offReady = mapEventBus.on('map:ready', () => {
      const map = mapController.getMap();
      if (map) setBounds(map.getBounds());
    });
    return () => {
      offMove();
      offReady();
    };
  }, []);

  if (!bounds) return markers;
  return markers.filter((m) => bounds.contains([m.lat, m.lng]));
}
