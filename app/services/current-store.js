import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

const categories = [
  {
    category_id: '1',
    name: 'Silk',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400',
  },
  {
    category_id: '2',
    name: 'Cotton',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400',
  },
  {
    category_id: '3',
    name: 'Designer',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400',
  },
  {
    category_id: '4',
    name: 'Party Wear',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400',
  },
  {
    category_id: '5',
    name: 'Casual',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400',
  },
  {
    category_id: '6',
    name: 'Wedding',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400',
  },
  {
    category_id: '7',
    name: 'Printed',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400',
  },
  {
    category_id: '8',
    name: 'Traditional',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400',
  },
  {
    category_id: '9',
    name: 'Banarsi',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400',
  },
  {
    category_id: '10',
    name: 'Chiffon',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400',
  },
  {
    category_id: '11',
    name: 'Georgette',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400',
  },
  {
    category_id: '12',
    name: 'Net',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400',
  },
  {
    category_id: '13',
    name: 'Linen',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400',
  },
  {
    category_id: '14',
    name: 'Velvet',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400',
  },
  {
    category_id: '15',
    name: 'Kanjivaram',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400',
  },
  {
    category_id: '16',
    name: 'Bandhani',
    image: 'https://images.unsplash.com/photo-1588776874580-905a1e8f8e3c?w=400',
  },
  {
    category_id: '17',
    name: 'Pochampally',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400',
  },
  {
    category_id: '18',
    name: 'Jamdani',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400',
  },
  {
    category_id: '19',
    name: 'Chikankari',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400',
  },
  {
    category_id: '20',
    name: 'Patola',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400',
  },
];

const tags = [
  'Special',
  'Best Seller',
  'Limited Stock',
  'On Sale',
  'Trending',
  'Bridal',
  'Festival',
  'Office Wear',
  'Summer',
  'Wedding',
  'Party',
  'Casual',
  'Traditional',
  'Designer',
  'Embroidered',
];

const youtubeVideos = [
  {
    id: 1,
    youtubeId: '_L4G-vJl3zU',
    title: 'Wedding Collection 2026',
    date: 'Apr 15, 2026',
    thumb: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400',
    featured_saree_ids: [1, 2, 3, 4, 5, 6, 7, 8],
  },
  {
    id: 2,
    youtubeId: 'op-3uwNubw0',
    title: 'Festival Special Collection',
    date: 'Apr 12, 2026',
    thumb: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400',
    featured_saree_ids: [6, 7, 8, 9, 10],
  },
  {
    id: 3,
    youtubeId: '2EZJKnH-QJo',
    title: 'Summer Collection 2026',
    date: 'Apr 10, 2026',
    thumb: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400',
    featured_saree_ids: [11, 12, 13, 14, 15],
  },
  {
    id: 4,
    youtubeId: 'dro9n7Yd1t0',
    title: 'Bridal Special Collection',
    date: 'Apr 8, 2026',
    thumb: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400',
    featured_saree_ids: [16, 17, 18, 19, 20],
  },
  {
    id: 5,
    youtubeId: 'LjhLHlur-d8',
    title: 'Office Wear Collection',
    date: 'Oct 12, 2025',
    thumb: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400',
    featured_saree_ids: [21, 22, 23, 24, 25],
  },
  {
    id: 6,
    youtubeId: 'ayVWVHGGuDg',
    title: 'Wedding Collections',
    date: 'Oct 12, 2025',
    thumb: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400',
    featured_saree_ids: [21, 22, 23, 24, 25],
  },
];

const productNames = [
  'Banarasi Silk Saree',
  'Kanjivaram Silk Saree',
  'Designer Silk Saree',
  'Bridal Silk Saree',
  'Bandhani Saree',
  'Chikankari Saree',
  'Patola Saree',
  'Cotton Saree',
  'Linen Saree',
  'Chiffon Saree',
  'Georgette Saree',
  'Net Saree',
  'Velvet Saree',
  'Pochampally Saree',
  'Jamdani Saree',
  'Traditional Saree',
  'Party Wear Saree',
  'Casual Saree',
  'Printed Saree',
  'Wedding Saree',
  'Embroidered Saree',
  'Handloom Silk Saree',
  'Modern Designer Saree',
  'Classic Silk Saree',
  'Floral Print Saree',
  'Royal Velvet Saree',
  'Elegant Georgette Saree',
  'Golden Zari Saree',
  'Maheshwari Silk Saree',
  'Baluvari Silk Saree',
  'Tussar Silk Saree',
  'Organza Saree',
  'Crepe Saree',
  'Satin Silk Saree',
  'Kota Doria Saree',
  'Mangalagiri Saree',
  'Gadwal Silk Saree',
  'Venkatagiri Saree',
  'Nellore Pattu Saree',
  'Narayanpet Saree',
];

const productDescriptions = [
  'Beautiful handwoven silk saree with intricate zari work',
  'Premium quality silk saree perfect for weddings and festivals',
  'Elegant designer saree with contemporary patterns',
  'Traditional wear with modern styling',
  'Lightweight and comfortable for daily wear',
  'Rich质感 with beautiful embroidery',
  'Perfect for special occasions',
  'Handcrafted with love by skilled artisans',
  'Classic design that never goes out of style',
  'Premium fabric with elegant drape',
];

const stockOptions = ['In Stock', 'Limited Stock', 'Out of Stock'];

function generateProducts() {
  const products = [];

  for (let i = 1; i <= 100; i++) {
    const price = 3000 + Math.floor(Math.random() * 27000);
    const discountPercent = [10, 15, 20, 30][Math.floor(Math.random() * 4)];
    const oldPrice = Math.floor(price / (1 - discountPercent / 100));

    // Create 3-7 color variants per saree to populate your swatches
    const variantCount = Math.floor(Math.random() * 8) + 3;
    const variants = [];
    const colors = [
      { name: 'Royal Blue', hex: '#002366' },
      { name: 'Ruby Red', hex: '#9b111e' },
      { name: 'Emerald Green', hex: '#046307' },
      { name: 'Golden Yellow', hex: '#FFD700' },
      { name: 'Magenta', hex: '#CA1F7B' },
      { name: 'Black Silver', hex: '#333333' },
      { name: 'Coral', hex: '#FF7F50' },
      { name: 'Turquoise', hex: '#40E0D0' },
    ];

    for (let j = 0; j < variantCount; j++) {
      variants.push({
        id: `${i}-${j}`,
        name: colors[j % colors.length].name,
        hex: colors[j % colors.length].hex,
        // Using a placeholder that changes per variant
        image: `https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400`,
      });
    }

    products.push({
      id: i,
      unique_id: `RS${String(i).padStart(4, '0')}`,
      name: `${productNames[i % productNames.length]} Saree Collection`,
      description: productDescriptions[i % productDescriptions.length],
      price: price,
      oldPrice: Math.random() > 0.5 ? oldPrice : null, // Only some have discounts
      discount: discountPercent,
      rating: (4 + Math.random()).toFixed(1),
      status: stockOptions[Math.floor(Math.random() * 3)],
      category_id: String((i % 5) + 1),
      variants: variants,
      tags: ['Special', 'Trending'].slice(0, Math.floor(Math.random() * 2) + 1),
    });
  }
  return products;
}

const products = generateProducts();

const storeInfo = {
  name: 'Riya Sri Silks',
  address: 'Sm Main Rd, mamallapuram, Tamil Nadu 600028',
  phone: '9383567645',
  email: 'riyasrisilks@gmail.com',
  instagram: 'https://www.instagram.com/riyasri_silks/',
  youtube: 'https://www.youtube.com/@riyasrisilk',
  whatsappNumber: '919876543210',
  whatsappMessage:
    'Hello Riya Sri Silks, shown your sarees in your website store, I am interested in purchasing. Please share more details.',
};

const handpickedSareesIds = [1, 5, 10, 15, 20];

export default class CurrentStoreService extends Service {
  @service cache;

  @tracked products = [];
  @tracked categories = [];
  @tracked tags = [];
  @tracked featuredIds = [];
  @tracked cartItems = [];
  @tracked tubeVideos = [];
  @tracked error = null;

  _fetching = null;

  async fetchStoreData() {
    if (this.cache.isCacheValid()) {
      try {
        const cached = await this.cache.loadCatalog();
        if (cached.products.length) {
          this._hydrate(cached);
          this._backgroundRefresh();
          return;
        }
      } catch {
        await this.cache.clearCatalog();
      }
    } else {
      this.cache.invalidateCache();
    }
    return this._fullFetch();
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
    this._fetching = new Promise((resolve) => {
      setTimeout(() => {
        const data = {
          categories,
          tags,
          tubeVideos: youtubeVideos,
          products,
          featuredIds: handpickedSareesIds,
        };
        this._hydrate(data);
        this.cache.saveCatalog(data);
        this._fetching = null;
        resolve();
      }, 1500);
    });
    return this._fetching;
  }

  async _backgroundRefresh() {
    if (!navigator.onLine) return;
    try {
      await this._fullFetch();
    } catch {
      // cached data is already showing — fail silently
    }
  }

  get youtubeVideos() {
    let videos = this.tubeVideos || [];
    videos.forEach((v) => {
      v.featuredSarees = v.featured_saree_ids
        .map((id) => this.products.find((p) => p.id === id))
        .filter(Boolean);
    });
    return videos;
  }
  // Assuming sarees come from a service or arguments
  get whatsappLink() {
    return `https://wa.me/${storeInfo.whatsappNumber}?text=${encodeURIComponent(
      storeInfo.whatsappMessage
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
      this.products?.filter((p) => p.tags?.includes('Special'))?.slice(0, 16) ||
      []
    );
  }
}
