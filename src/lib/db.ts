import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { HifzCard, Settings } from './types';

interface Schema extends DBSchema {
  kv: { key: string; value: unknown }; // settings, progress, misc singletons
  bookmarks: { key: string; value: { key: string; surah: number; ayah: number; at: number } };
  hifz: { key: string; value: HifzCard };
  tafsir: { key: string; value: { id: string; data: Record<string, string> } };
}

let dbp: Promise<IDBPDatabase<Schema>> | null = null;

function db() {
  if (!dbp)
    dbp = openDB<Schema>('al-furqan', 1, {
      upgrade(d) {
        d.createObjectStore('kv');
        d.createObjectStore('bookmarks', { keyPath: 'key' });
        d.createObjectStore('hifz', { keyPath: 'key' });
        d.createObjectStore('tafsir', { keyPath: 'id' });
      },
    });
  return dbp;
}

export async function loadSettings(): Promise<Partial<Settings> | undefined> {
  return (await db()).get('kv', 'settings') as Promise<Partial<Settings> | undefined>;
}
export async function saveSettings(s: Settings) {
  await (await db()).put('kv', s, 'settings');
}

export async function getKv<T>(key: string): Promise<T | undefined> {
  return (await db()).get('kv', key) as Promise<T | undefined>;
}
export async function setKv(key: string, value: unknown) {
  await (await db()).put('kv', value, key);
}

export async function allBookmarks() {
  return (await db()).getAll('bookmarks');
}
export async function toggleBookmark(surah: number, ayah: number) {
  const d = await db();
  const key = `${surah}:${ayah}`;
  if (await d.get('bookmarks', key)) {
    await d.delete('bookmarks', key);
    return false;
  }
  await d.put('bookmarks', { key, surah, ayah, at: Date.now() });
  return true;
}

export async function allHifz() {
  return (await db()).getAll('hifz');
}
export async function putHifz(card: HifzCard) {
  await (await db()).put('hifz', card);
}
export async function deleteHifz(key: string) {
  await (await db()).delete('hifz', key);
}

export async function getTafsirDownload(id: string) {
  return (await db()).get('tafsir', id);
}
export async function putTafsirDownload(id: string, data: Record<string, string>) {
  await (await db()).put('tafsir', { id, data });
}
export async function deleteTafsirDownload(id: string) {
  await (await db()).delete('tafsir', id);
}
export async function downloadedTafsirIds() {
  return (await db()).getAllKeys('tafsir');
}

// Progress backup: settings + bookmarks + hifz + last-read (not the bulky tafsir).
export async function exportData() {
  const d = await db();
  return {
    settings: await d.get('kv', 'settings'),
    lastRead: await d.get('kv', 'lastRead'),
    bookmarks: await d.getAll('bookmarks'),
    hifz: await d.getAll('hifz'),
  };
}

export async function importData(data: Awaited<ReturnType<typeof exportData>>) {
  const d = await db();
  if (data.settings) await d.put('kv', data.settings, 'settings');
  if (data.lastRead) await d.put('kv', data.lastRead, 'lastRead');
  for (const b of data.bookmarks ?? []) await d.put('bookmarks', b);
  for (const c of data.hifz ?? []) await d.put('hifz', c);
}

export async function resetAll() {
  const d = await db();
  for (const store of ['kv', 'bookmarks', 'hifz', 'tafsir'] as const) await d.clear(store);
  for (const name of await caches.keys()) await caches.delete(name);
}
