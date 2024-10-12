import pako from 'pako';
import { type UUID, type PayloadFull, type PayloadMinimal, schemaPayloadMinimal } from '../types';

export const randomUUID: () => UUID = () => crypto.randomUUID() as UUID;

const fromJSON = (raw: unknown): any | undefined => {
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw);
    } catch {
      return;
    }
  }
  if (raw && typeof raw === 'object') {
    return raw;
  }
};

const toCopyString = (raw: unknown): string => {
  let json: unknown;
  try {
    json = JSON.stringify(raw);
  } catch {}
  if (typeof json !== 'string') {
    return '';
  }
  let compressed: Uint8Array | undefined;
  try {
    compressed = pako.deflate(json);
  } catch {}
  if (!compressed) {
    return '';
  }
  const text = String.fromCharCode(...compressed);
  try {
    return btoa(text);
  } catch {}
  return '';
};

const fromCopyString = (raw: string): unknown => {
  let text: string | undefined;
  try {
    text = atob(raw);
  } catch {}
  if (typeof text !== 'string') {
    return;
  }
  let compressed: Uint8Array | undefined;
  try {
    compressed = Uint8Array.from(text, (c) => c.charCodeAt(0));
  } catch {
    return;
  }
  let data: string | undefined;
  try {
    data = pako.inflate(compressed, { to: 'string' });
  } catch {}
  if (!data) {
    return;
  }
  return fromJSON(data);
};

export const importPayload = (raw: string): PayloadMinimal | undefined => {
  const data = fromCopyString(raw);
  const results = schemaPayloadMinimal.safeParse(data);
  if (!results.success) {
    return;
  }
  return results.data;
};

const recursiveRandomId = (target: unknown): void => {
  if (!target || typeof target !== 'object') {
    return;
  }
  if (Array.isArray(target)) {
    for (const o of target) {
      recursiveRandomId(o);
    }
    return;
  }
  (target as any).id = randomUUID();
  for (const o in target) {
    recursiveRandomId(target[o as keyof typeof target]);
  }
};

export const inflatePayload = (payload: PayloadMinimal): PayloadFull => {
  const { bosses, characters, teams } = payload;
  recursiveRandomId(bosses);
  recursiveRandomId(characters);
  recursiveRandomId(teams);
  return payload as never;
};

const unsetIgnoredProps = <T extends { ignore?: boolean }>(props: T[]): void => {
  for (const prop of props) {
    if (!prop.ignore) {
      prop.ignore = undefined as never;
    }
  }
};

export const exportPayload = (data: PayloadFull | PayloadMinimal): string | undefined => {
  const results = schemaPayloadMinimal.safeParse(data);
  if (!results.success) {
    return;
  }
  const payload = results.data;
  unsetIgnoredProps(payload.bosses);
  unsetIgnoredProps(payload.characters);
  return toCopyString(payload);
};

export const copyToClipboard = async (data?: string): Promise<boolean | Error> => {
  if (typeof data !== 'string') {
    return false;
  }
  try {
    await navigator.clipboard.writeText(data);
    return true;
  } catch (ex) {
    return ex as Error;
  }
};
