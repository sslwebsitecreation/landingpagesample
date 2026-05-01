import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ProductDetailsController extends Controller {
  @service currentStore;

  @tracked isModalOpen = false;
  @tracked activeVariant = null;

  get product() {
    return this.model.product;
  }

  get relatedProducts() {
    return this.model.relatedProducts;
  }

  @action
  selectVariant(variant) {
    this.activeVariant = variant;
  }

  @action
  openModal() {
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  @action
  closeModal() {
    this.isModalOpen = false;
    document.body.style.overflow = 'auto';
  }

  @action
  addToCart(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const existing = this.currentStore.cartItems.find(
      (item) => item.id === this.product.id
    );

    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
      this.currentStore.cartItems = [...this.currentStore.cartItems];
    } else {
      const cartItem = {
        ...this.product,
        selectedVariant: this.activeVariant,
        quantity: 1,
      };
      this.currentStore.cartItems = [...this.currentStore.cartItems, cartItem];
    }
  }

  @action
  openEnquiry() {
    const product = this.product;
    const variant = this.activeVariant || product.variants[0];
    const productLink = `${window.location.origin}/product/${product.id}`;

    let message = `Hello Riya Sri Silks, I'm inquiring about:%0A%0A`;
    message += `*Product:* ${product.name}%0A`;
    message += `*Variant:* ${variant.name}%0A`;
    message += `*Price:* ₹${product.price}%0A`;
    message += `*Link:* ${productLink}`;

    window.open(`https://wa.me/919876543210?text=${message}`, '_blank');
  }
}
