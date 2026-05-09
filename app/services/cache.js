import Service from '@ember/service';
import ENV from 'dummysri/config/environment';

// ─── Image Caching Strategy ────────────────────────────────────────────
// For production, configure your CDN/origin with:
//
//   Cache-Control: public, max-age=31536000, immutable
//
// for product images. Use versioned URLs (e.g. /images/saree-123.webp?v=2)
// so that a new deployment busts the browser cache automatically.
//
// Recommended image pipeline:
//   1. Serve WebP with AVIF fallback via <picture> or Accept negotiation
//   2. Use srcset with multiple widths (400w, 800w, 1200w)
//   3. Lazy-load below-fold images with loading="lazy"
//   4. Set explicit width/height to prevent layout shift
//
// The IndexedDB below caches the catalog JSON (meta, prices, variants).
// Browser HTTP cache handles the actual image binaries separately.
// ────────────────────────────────────────────────────────────────────────

const DB_NAME = 'dummysri-catalog';
const DB_VERSION = 1;
const STORE_NAME = 'store';

export default class CacheService extends Service {
  _db = null;

  async _openDB() {
    if (this._db) return this._db;
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
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

  async _tx(mode, callback) {
    const db = await this._openDB();
    return new Promise((resolve, reject) => {
      try {
        const tx = db.transaction(STORE_NAME, mode);
        const store = tx.objectStore(STORE_NAME);
        callback(store, resolve, reject);
        tx.oncomplete = () => resolve();
        tx.onerror = (e) => reject(e.target.error);
      } catch (err) {
        reject(err);
      }
    });
  }

  async getItem(key) {
    try {
      const db = await this._openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const request = store.get(key);
        request.onsuccess = () =>
          resolve(request.result !== undefined ? request.result : null);
        request.onerror = () => reject(request.error);
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

  isCacheValid() {
    return this.version === this.buildStamp;
  }

  invalidateCache() {
    this.version = null;
  }

  async loadCatalog() {
    const [products, categories, tags, tubeVideos, featuredIds] =
      await Promise.all([
        this.getItem('products'),
        this.getItem('categories'),
        this.getItem('tags'),
        this.getItem('tubeVideos'),
        this.getItem('featuredIds'),
      ]);
    return {
      products: products || [],
      categories: categories || [],
      tags: tags || [],
      tubeVideos: tubeVideos || [],
      featuredIds: featuredIds || [],
    };
  }

  async saveCatalog(data) {
    await Promise.all([
      this.setItem('products', data.products || []),
      this.setItem('categories', data.categories || []),
      this.setItem('tags', data.tags || []),
      this.setItem('tubeVideos', data.tubeVideos || []),
      this.setItem('featuredIds', data.featuredIds || []),
    ]);
    this.version = this.buildStamp;
  }

  async clearCatalog() {
    try {
      await this.clear();
    } catch {
      // ignore clear failures
    }
    this.version = null;
  }
}
