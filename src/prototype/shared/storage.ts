import { useEffect, useState } from "react";

type StorageState = "pending" | "saved" | "session";
const writes = new Map<string, boolean>();
const storageEvent = "gptx:prototype-storage";

function statusFor(slug: string): StorageState {
  const results = [...writes.entries()]
    .filter(([key]) => key.startsWith(`gptx.prototype.${slug}.`))
    .map(([, ok]) => ok);
  return results.some((ok) => !ok)
    ? "session"
    : results.length
      ? "saved"
      : "pending";
}
function report(slug: string, key: string, ok: boolean) {
  writes.set(key, ok);
  window.dispatchEvent(new CustomEvent(storageEvent, { detail: { slug } }));
}
export function readStorage(slug: string, key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    report(slug, key, false);
    return null;
  }
}
export function writeStorage(slug: string, key: string, value: string) {
  try {
    localStorage.setItem(key, value);
    report(slug, key, true);
  } catch {
    report(slug, key, false);
  }
}
export function useStorageStatus(slug: string) {
  const [status, setStatus] = useState<StorageState>(() => statusFor(slug));
  useEffect(() => {
    const update = (event: Event) => {
      if ((event as CustomEvent<{ slug: string }>).detail.slug === slug)
        setStatus(statusFor(slug));
    };
    window.addEventListener(storageEvent, update);
    setStatus(statusFor(slug));
    return () => window.removeEventListener(storageEvent, update);
  }, [slug]);
  return status;
}

/** Validate the seeded structure; domains can supply additional semantic validation. */
function sameShape(value: unknown, example: unknown): boolean {
  if (Array.isArray(example))
    return (
      Array.isArray(value) &&
      (!example.length || value.every((item) => sameShape(item, example[0])))
    );
  if (example === null) return value === null;
  if (typeof example === "object") {
    return (
      value !== null &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      Object.entries(example).every(([key, item]) =>
        sameShape((value as Record<string, unknown>)[key], item),
      )
    );
  }
  return (
    typeof value === typeof example &&
    (typeof value !== "number" || Number.isFinite(value))
  );
}
export function useDemo<T extends object>(
  slug: string,
  seed: T,
  validate?: (state: T) => boolean,
) {
  const key = `gptx.prototype.${slug}.v1`;
  const [state, setState] = useState<T>(() => {
    try {
      const parsed = JSON.parse(readStorage(slug, key) || "null");
      if (
        parsed?.version === 1 &&
        sameShape(parsed.data, seed) &&
        (!validate || validate(parsed.data))
      )
        return parsed.data;
    } catch {
      /* Recover an incompatible or malformed saved demo with its own seed. */
    }
    return structuredClone(seed);
  });
  useEffect(() => {
    writeStorage(slug, key, JSON.stringify({ version: 1, data: state }));
  }, [key, slug, state]);
  return { state, setState, reset: () => setState(structuredClone(seed)) };
}
