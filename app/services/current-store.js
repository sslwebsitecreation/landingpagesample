import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import ENV from 'riyasrisilks/config/environment';

const WHATSAPP_NUMBER = '9244443777';
const WHATSAPP_MESSAGE =
  'Hello Riyasri Silks, shown your sarees in your website store, I am interested in purchasing. Please share more details.';

export default class CurrentStoreService extends Service {
  @service cache;
  @service loading;

  @tracked products = [];
  @tracked categories = [];
  @tracked tags = [];
  @tracked featuredIds = [];
  @tracked cartItems = [];
  @tracked tubeVideos = [];
  @tracked error = null;

  _fetching = null;

  whatsappNumber = WHATSAPP_NUMBER;

  _isRefreshDue() {
    const lastFetched = localStorage.getItem('riyasrisilks-last-fetched');
    if (!lastFetched) return true;

    const lastFetch = Number(lastFetched);
    const now = Date.now();
    const IST_OFFSET = 5.5 * 60 * 60 * 1000;

    const scheduleHours = [11, 15, 18];

    for (const hour of scheduleHours) {
      const scheduled = new Date(now + IST_OFFSET);
      scheduled.setUTCHours(hour, 0, 0, 0);
      const scheduledTS = scheduled.getTime() - IST_OFFSET;

      if (scheduledTS > lastFetch && scheduledTS <= now) {
        return true;
      }
    }

    return false;
  }

  async fetchStoreData() {
    this.loading.startLoading();
    try {
      if (!this._isRefreshDue() && this.cache.isCacheValid()) {
        try {
          const cached = await this.cache.loadCatalog();
          if (cached && cached.products.length) {
            this._hydrate(cached);
            return;
          }
        } catch {
          await this.cache.clearCatalog();
        }
      } else {
        this.cache.invalidateCache();
      }
      try {
        return await this._fullFetch();
      } catch {
        const cached = await this.cache.loadCatalog().catch(() => null);
        if (cached && cached.products.length) {
          this._hydrate(cached);
          return;
        }
        throw new Error('Failed to fetch data and no cache available');
      }
    } finally {
      this.loading.stopLoading();
    }
  }

  _hydrate(data) {
    this.categories = data.categories ? [...data.categories] : [];
    this.tags = data.tags ? [...data.tags] : [];
    this.tubeVideos = data.tubeVideos ? [...data.tubeVideos] : [];
    this.products = data.products ? [...data.products] : [];
    this.featuredIds = data.featuredIds ? [...data.featuredIds] : [];
  }

  async _fullFetch() {
    if (this._fetching) return this._fetching;

    const API_URL = ENV.APP.apiBaseUrl || '/api/v1';

    this._fetching = fetch(`${API_URL}/all`)
      .then((r) => {
        if (!r.ok) throw new Error(`API error: ${r.status}`);
        return r.json();
      })
      .then((data) => {
        const mapped = this._mapApiResponse(data);
        this._hydrate(mapped);
        this.cache.saveCatalog(mapped);
        this._fetching = null;
      })
      .catch((err) => {
        this._fetching = null;
        throw err;
      });

    return this._fetching;
  }

  _mapApiResponse(data) {
    const apiProducts = data.products || [];
    const apiVideos = data.youtube_videos || [];

    const IMG_CDN = (ENV.APP.imageCdnUrl || '').replace(/\/+$/, '');

    const CAT_IMAGES = [
      '/images/categories/cat-01.svg',
      '/images/categories/cat-02.svg',
      '/images/categories/cat-03.svg',
      '/images/categories/cat-04.svg',
      '/images/categories/cat-05.svg',
      '/images/categories/cat-06.svg',
      '/images/categories/cat-07.svg',
      '/images/categories/cat-08.svg',
      '/images/categories/cat-09.svg',
      '/images/categories/cat-10.svg'
    ];

    const catNames = [
      ...new Set(apiProducts.map((p) => p.category).filter(Boolean)),
    ];
    const cats = catNames.map((name, i) => ({
      category_id: name,
      name,
      image: CAT_IMAGES[i % CAT_IMAGES.length],
    }));

    const allTags = new Set();

    const products = apiProducts.map((p) => {
      const hasDiscount =
        p.discounted_price &&
        p.original_price &&
        p.discounted_price < p.original_price;
      const discount = hasDiscount
        ? Math.abs(Math.round((1 - (p.discounted_price / (p.original_price || 1))) * 100)) || 0
        : 0;

      const variants = (p.images || []).map((img, idx) => ({
        id: img.id || `${p.id}-${idx}`,
        name: img.color_name || img.color || '',
        hex: img.color || '#000000',
        image: img.key && IMG_CDN ? `${IMG_CDN}/${img.key}` : '',
      }));

      if (!variants.length) {
        variants.push({
          id: `${p.id}-0`,
          name: 'Default',
          hex: '#000000',
          image: '',
        });
      }

      const tags = [];
      if (hasDiscount) tags.push('On Sale');
      if (p.stock_count > 0 && p.stock_count < 10) tags.push('Limited Stock');
      if (p.stock_count >= 10) tags.push('Trending');
      if (p.tags) {
        String(p.tags)
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
          .forEach((t) => {
            if (!tags.includes(t)) tags.push(t);
          });
      }
      tags.forEach((t) => allTags.add(t));

      return {
        id: p.id,
        unique_id: `RS${String(p.id).padStart(4, '0')}`,
        name: p.name || '',
        description: p.description || '',
        price: p.discounted_price || p.original_price || 0,
        oldPrice: hasDiscount ? p.original_price : null,
        discount,
        rating: '4.5',
        stockCount: p.stock_count || 0,
        status:
          p.stock_count === 0
            ? 'out_of_stock'
            : p.stock_count < 10
              ? 'limited_stock'
              : 'in_stock',
        inStock: (p.stock_count || 0) > 0,
        category: p.category || '',
        category_id: p.category || '',
        variants,
        tags,
      };
    });

    const featuredIds = apiProducts
      .filter((p) =>
        String(p.tags || '')
          .split(',')
          .map((t) => t.trim())
          .includes('Handpicked')
      )
      .map((p) => p.id);

    const tubeVideos = apiVideos.map((v) => ({
      id: v.id,
      youtubeId: v.link || '',
      title: v.title || '',
      description: v.description || '',
      date: v.created_at
        ? new Date(v.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        : '',
      product_ids: v.product_ids
        ? String(v.product_ids)
            .split(',')
            .map(Number)
            .filter((n) => !isNaN(n))
        : [],
    }));

    return {
      products,
      categories: cats,
      tags: [...allTags],
      tubeVideos,
      featuredIds,
    };
  }

  get youtubeVideos() {
    let videos = this.tubeVideos || [];
    videos.forEach((v) => {
      v.featuredSarees = v.product_ids
        .map((id) => this.products.find((p) => p.id === id))
        .filter(Boolean);
    });
    return videos;
  }
  get whatsappLink() {
    return `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(
      WHATSAPP_MESSAGE
    )}`;
  }

  get handpickedSarees() {
    return this.products.filter((p) => this.featuredIds.includes(p.id));
  }

  get trendingSarees() {
    return (
      this.products
        ?.filter((p) => p.tags?.includes('Trending'))
        ?.slice(0, 16) || []
    );
  }

  get specialCollectionSarees() {
    return (
      this.products?.filter((p) => p.tags?.includes('Handpicked'))?.slice(0, 16) ||
      []
    );
  }
}
