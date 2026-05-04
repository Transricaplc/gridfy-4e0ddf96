/**
 * Map Event Bus — Phase A (foundation)
 *
 * Tiny typed pub/sub for map-wide events. Decouples map components from
 * each other so Layers, Sidebars, MiniMap, TimeSlider, etc. can subscribe
 * without prop-drilling.
 *
 * Events are debounced where useful (move/zoom) by the publisher.
 */

import type { LatLngBounds, LatLng } from 'leaflet';

export type MapEventMap = {
  'map:move': { center: LatLng; bounds: LatLngBounds; zoom: number };
  'map:zoom': { zoom: number };
  'map:ready': { center: LatLng; zoom: number };
  'marker:select': { id: string; type: string; lat: number; lng: number };
  'marker:hover': { id: string | null };
  'layer:toggle': { id: string; enabled: boolean };
  'layer:opacity': { id: string; opacity: number };
  'camera:focus': { lat: number; lng: number; zoom?: number };
  'camera:fit': { bounds: LatLngBounds; padding?: number };
  'live:tick': { timestamp: number };
};

type EventName = keyof MapEventMap;
type Handler<E extends EventName> = (payload: MapEventMap[E]) => void;

class MapEventBus {
  private handlers: Map<EventName, Set<Handler<EventName>>> = new Map();

  on<E extends EventName>(event: E, handler: Handler<E>): () => void {
    let set = this.handlers.get(event);
    if (!set) {
      set = new Set();
      this.handlers.set(event, set);
    }
    set.add(handler as Handler<EventName>);
    return () => this.off(event, handler);
  }

  off<E extends EventName>(event: E, handler: Handler<E>): void {
    this.handlers.get(event)?.delete(handler as Handler<EventName>);
  }

  emit<E extends EventName>(event: E, payload: MapEventMap[E]): void {
    const set = this.handlers.get(event);
    if (!set) return;
    set.forEach(h => {
      try {
        (h as Handler<E>)(payload);
      } catch (err) {
        // Never let a subscriber crash the bus
        // eslint-disable-next-line no-console
        console.error(`[mapEventBus] handler for "${event}" threw`, err);
      }
    });
  }

  clear(): void {
    this.handlers.clear();
  }
}

export const mapEventBus = new MapEventBus();
