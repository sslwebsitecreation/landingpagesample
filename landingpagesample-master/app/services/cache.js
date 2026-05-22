import Service from '@ember/service';
import ENV from 'dummysri/config/environment';

// ─── Image Caching Strategy ────────────────────────────────────────────
// Configure CDN/origin:
//
// Cache-Control: public, max-age=31536000, immutable
//
// Use versioned image URLs:
// /images/saree-123.webp?v=2
//
// Recommended:
// - WebP/AVIF
// - srcset responsive images
// - loading="lazy"
// - explicit width/height
// ────────────────────────────────────────────────────────────────────────

const DB_NAME = 'dummysri-catalog';
const DB_VERSION = 2;
const STORE_NAME = 'store';

// 30 minutes cache expiry
const CACHE_MAX_AGE = 1000 * 60 * 30;

export default class CacheService extends Service {
  _db = null;

  // In-memory cache
  _catalogCache = null;

  // Prevent duplicate simultaneous loads
  _loadingPromise = null;

  async _openDB() {
    if (this._db) {
      return this._db;
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (e) => {
        const db = e.target.result;

        // Initial store creation
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }

        // Future migrations
        if (e.oldVersion < 2) {
          // Migration logic placeholder
          // Example:
          // const store = request.transaction.objectStore(STORE_NAME);
        }
      };

      request.onsuccess = (e) => {
        this._db = e.target.result;

        this._db.onversionchange = () => {
          this._db.close();
          this._db = null;
        };

        resolve(this._db);
      };

      request.onerror = () => {
        this._db = null;
        reject(new Error('IndexedDB open failed'));
      };
    });
  }

  async getItem(key) {
    try {
      const db = await this._openDB();

      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);

        const request = store.get(key);

        request.onsuccess = () => {
          resolve(
            request.result !== undefined ? request.result : null
          );
        };

        request.onerror = () => {
          reject(request.error);
        };
      });
    } catch {
      return null;
    }
  }

  async setItem(key, value) {
    const db = await this._openDB();

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);

      store.put(value, key);

      tx.oncomplete = () => resolve();

      tx.onerror = (e) => reject(e.target.error);
    });
  }

  async removeItem(key) {
    const db = await this._openDB();

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);

      store.delete(key);

      tx.oncomplete = () => resolve();

      tx.onerror = (e) => reject(e.target.error);
    });
  }

  async clear() {
    const db = await this._openDB();

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);

      store.clear();

      tx.oncomplete = () => resolve();

      tx.onerror = (e) => reject(e.target.error);
    });
  }

  get version() {
    try {
      return localStorage.getItem('dummysri-cache-v');
    } catch {
      return null;
    }
  }

  set version(val) {
    try {
      if (val) {
        localStorage.setItem('dummysri-cache-v', val);
      } else {
        localStorage.removeItem('dummysri-cache-v');
      }
    } catch {
      // localStorage unavailable
    }
  }

  get buildStamp() {
    return String(ENV.APP.buildStamp || '0');
  }

  async getCachedAt() {
    return await this.getItem('cachedAt');
  }

  async setCachedAt() {
    await this.setItem('cachedAt', Date.now());
  }

  async isCacheExpired() {
    const cachedAt = await this.getCachedAt();

    if (!cachedAt) {
      return true;
    }

    return Date.now() - cachedAt > CACHE_MAX_AGE;
  }

  async isCacheValid() {
    if (this.version !== this.buildStamp) {
      return false;
    }

    const expired = await this.isCacheExpired();

    return !expired;
  }

  invalidateCache() {
    this.version = null;
    this._catalogCache = null;
  }

  async loadCatalog() {
    // 1. Memory cache
    if (this._catalogCache) {
      return this._catalogCache;
    }

    // 2. Prevent duplicate simultaneous reads
    if (this._loadingPromise) {
      return this._loadingPromise;
    }

    this._loadingPromise = (async () => {
      try {
        const [
          products,
          categories,
          tags,
          tubeVideos,
          featuredIds,
        ] = await Promise.all([
          this.getItem('products'),
          this.getItem('categories'),
          this.getItem('tags'),
          this.getItem('tubeVideos'),
          this.getItem('featuredIds'),
        ]);

        const catalog = {
          products: products || [],
          categories: categories || [],
          tags: tags || [],
          tubeVideos: tubeVideos || [],
          featuredIds: featuredIds || [],
        };

        // Save to memory cache
        this._catalogCache = catalog;

        return catalog;
      } finally {
        this._loadingPromise = null;
      }
    })();

    return this._loadingPromise;
  }

  async saveCatalog(data) {
    await Promise.all([
      this.setItem('products', data.products || []),
      this.setItem('categories', data.categories || []),
      this.setItem('tags', data.tags || []),
      this.setItem('tubeVideos', data.tubeVideos || []),
      this.setItem('featuredIds', data.featuredIds || []),
      this.setCachedAt(),
    ]);

    this.version = this.buildStamp;

    // Update memory cache
    this._catalogCache = {
      products: data.products || [],
      categories: data.categories || [],
      tags: data.tags || [],
      tubeVideos: data.tubeVideos || [],
      featuredIds: data.featuredIds || [],
    };
  }

  async clearCatalog() {
    try {
      await this.clear();
    } catch {
      // ignore clear failures
    }

    this.version = null;
    this._catalogCache = null;
    this._loadingPromise = null;
  }
}