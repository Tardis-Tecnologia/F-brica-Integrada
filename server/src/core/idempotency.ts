export type SeenStore = Set<string>;

export function eventKey(source: string, externalId: string, kind: string) {
  return `${source}:${kind}:${externalId}`;
}

export function claimEvent(store: SeenStore, source: string, externalId: string, kind: string) {
  const key = eventKey(source, externalId, kind);
  if (store.has(key)) return { accepted: false, key };
  store.add(key);
  return { accepted: true, key };
}
