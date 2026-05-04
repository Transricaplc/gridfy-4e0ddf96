/**
 * CameraController — Phase A (foundation)
 *
 * Centralised, animated camera moves on top of MapController. Use this
 * instead of poking map.setView / flyTo directly so behaviour stays
 * consistent (durations, easing, follow-mode rules).
 *
 * Follow mode: when enabled with a target id, the camera re-centres on
 * each `camera:focus` payload that matches that id (used for live data
 * points such as an in-progress journey).
 */

import L, { type LatLngBoundsExpression, type LatLngExpression } from 'leaflet';
import { mapController } from './MapController';
import { mapEventBus } from './mapEventBus';

const DEFAULT_DURATION = 0.8; // seconds, Leaflet flyTo

export interface FocusOptions {
  zoom?: number;
  duration?: number;
  /** When true, future "camera:focus" events with this id will re-centre. */
  follow?: boolean;
  followId?: string;
}

class CameraController {
  private followId: string | null = null;

  /** Smoothly pan/zoom to a coordinate. */
  focus(lat: number, lng: number, opts: FocusOptions = {}): void {
    const map = mapController.getMap();
    if (!map) return;
    const target: LatLngExpression = [lat, lng];
    const zoom = opts.zoom ?? map.getZoom();
    map.flyTo(target, zoom, { duration: opts.duration ?? DEFAULT_DURATION });
    if (opts.follow && opts.followId) {
      this.followId = opts.followId;
    }
    mapEventBus.emit('camera:focus', { lat, lng, zoom });
  }

  /** Auto-fit a set of bounds with optional padding (px). */
  fitBounds(bounds: LatLngBoundsExpression, paddingPx: number = 48): void {
    const map = mapController.getMap();
    if (!map) return;
    const latLngBounds = L.latLngBounds(bounds as L.LatLngBoundsLiteral);
    map.flyToBounds(latLngBounds, {
      padding: [paddingPx, paddingPx],
      duration: DEFAULT_DURATION,
    });
    mapEventBus.emit('camera:fit', { bounds: latLngBounds, padding: paddingPx });
  }

  /** Fit the map to a list of points. No-op for empty lists. */
  fitToPoints(points: Array<{ lat: number; lng: number }>, paddingPx = 48): void {
    if (points.length === 0) return;
    if (points.length === 1) {
      this.focus(points[0].lat, points[0].lng, { zoom: 15 });
      return;
    }
    const bounds = L.latLngBounds(points.map(p => [p.lat, p.lng] as [number, number]));
    this.fitBounds(bounds, paddingPx);
  }

  /** Stop following the current target. */
  stopFollow(): void {
    this.followId = null;
  }

  isFollowing(id?: string): boolean {
    return id ? this.followId === id : this.followId !== null;
  }

  /** Re-centre on a live target if it matches the active follow id. */
  tickFollow(id: string, lat: number, lng: number): void {
    if (this.followId !== id) return;
    const map = mapController.getMap();
    if (!map) return;
    map.panTo([lat, lng], { animate: true, duration: 0.5 });
  }
}

export const cameraController = new CameraController();
