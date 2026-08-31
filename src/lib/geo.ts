import { getKv, setKv } from './db';

export interface Coords {
  lat: number;
  lng: number;
}

// Last known location (so prayer times work offline after first fix).
export async function savedCoords(): Promise<Coords | undefined> {
  return getKv<Coords>('coords');
}

export function currentCoords(): Promise<Coords> {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) return reject(new Error('no geolocation'));
    navigator.geolocation.getCurrentPosition(
      (p) => {
        const c = { lat: p.coords.latitude, lng: p.coords.longitude };
        void setKv('coords', c);
        resolve(c);
      },
      reject,
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 3_600_000 },
    );
  });
}
