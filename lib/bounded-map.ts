// A Map that holds at most `max` entries. Reading or writing an entry marks it as recently used, and once the map is
// full the least recently used entry is dropped. For in-memory caches and counters whose keys come from requests,
// so a flood of distinct keys can't grow the server's memory without limit
export class BoundedMap<K, V> {
  private readonly entries = new Map<K, V>()
  private readonly max: number

  constructor(max: number) {
    this.max = max
  }

  get size() {
    return this.entries.size
  }

  get(key: K): V | undefined {
    if (!this.entries.has(key)) return undefined
    const value = this.entries.get(key) as V
    // Map keeps insertion order, so moving the entry to the end marks it as the most recently used
    this.entries.delete(key)
    this.entries.set(key, value)
    return value
  }

  set(key: K, value: V) {
    this.entries.delete(key)
    this.entries.set(key, value)
    while (this.entries.size > this.max) this.entries.delete(this.entries.keys().next().value as K)
    return this
  }

  delete(key: K) {
    return this.entries.delete(key)
  }
}
