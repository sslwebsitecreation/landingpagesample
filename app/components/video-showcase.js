import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { next, later } from '@ember/runloop';

export default class VideoShowcaseComponent extends Component {
  @service currentStore;
  @service toast;

  @tracked activeIndex = 0;
  @tracked isTransitioning = false;

  constructor() {
    super(...arguments);
    next(this, this.autoSelectFirst);
  }

  autoSelectFirst() {
    this.activeIndex = 0;
  }

  get videos() {
    return this.currentStore.youtubeVideos || [];
  }

  get activeVideo() {
    return this.videos[this.activeIndex];
  }

  get sareeCount() {
    return this.activeVideo?.featuredSarees?.length || 0;
  }

  get hasMultiple() {
    return this.videos.length > 1;
  }

  @action
  selectVideo(index) {
    if (this.activeIndex === index) return;
    this.isTransitioning = true;
    later(this, () => {
      this.activeIndex = index;
      later(this, () => {
        this.isTransitioning = false;
      }, 50);
    }, 300);
  }

  @action
  nextVideo() {
    const next = (this.activeIndex + 1) % this.videos.length;
    this.selectVideo(next);
  }

  @action
  prevVideo() {
    const prev = (this.activeIndex - 1 + this.videos.length) % this.videos.length;
    this.selectVideo(prev);
  }

  @action
  addToCart(product, event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const variant = product.variants?.[0] || {};
    const variantId = variant.id;
    const existing = this.currentStore.cartItems.find(
      (item) => item.id === product.id && item.selectedVariant?.id === variantId
    );
    if (existing) {
      this.currentStore.cartItems = this.currentStore.cartItems.map((item) => {
        if (item.id === product.id && item.selectedVariant?.id === variantId) {
          return { ...item, quantity: (item.quantity || 1) + 1 };
        }
        return item;
      });
    } else {
      const cartItem = {
        ...product,
        selectedVariant: variant,
        quantity: 1,
      };
      this.currentStore.cartItems = [...this.currentStore.cartItems, cartItem];
      this.toast.show('Added to cart', 'success');
    }
  }

  @action
  stopPropagation(e) {
    e.stopPropagation();
  }
}
