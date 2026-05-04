/**
 * MapController — Phase A (foundation)
 *
 * Singleton holding a reference to the *active* Leaflet map instance.
 * Why a singleton: react-leaflet creates a new map per <MapContainer />,
 * but the rest of the app (mini-map, time slider, drawing tools, search
 * overlays, controllers) needs a stable handle without prop-drilling or
 * relying on `useMap()` (which only works inside MapContainer children).
 *
 * Lifecycle:
 *   - <MapInstanceRegistrar /> registers the map on mount, unregisters on unmount.
 *   - Consumers call mapController.getMap() and must handle `null`.
 *   - All mutations should go through CameraController (camera moves) or
 *     LayerManager (layer state) — never poke the raw map directly from UI.
 */

import type { Map as LeafletMap } from 'leaflet';

class MapController {
  private map: LeafletMap | null = null;
  private readyResolvers: Array<(map: LeafletMap) => void> = [];

  register(map: LeafletMap): void {
    this.map = map;
    // Flush any waiters
    this.readyResolvers.forEach(r => r(map));
    this.readyResolvers = [];
  }

  unregister(map: LeafletMap): void {
    if (this.map === map) {
      this.map = null;
    }
  }

  getMap(): LeafletMap | null {
    return this.map;
  }

  /**
   * Resolves once a map instance is registered (or immediately if already there).
   * Useful for subscribers that mount before the map.
   */
  whenReady(): Promise<LeafletMap> {
    if (this.map) return Promise.resolve(this.map);
    return new Promise(resolve => this.readyResolvers.push(resolve));
  }
}

export const mapController = new MapController();
