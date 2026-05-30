import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ProductDetailsController extends Controller {
  @service currentStore;
  @service toast;

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
  stopPropagation(event) {
    event.stopPropagation();
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
      this.currentStore.cartItems = this.currentStore.cartItems.map((item) => {
        if (item.id === this.product.id) {
          return { ...item, quantity: (item.quantity || 1) + 1 };
        }
        return item;
      });
      this.toast.show('Quantity updated', 'success');
    } else {
      const cartItem = {
        ...this.product,
        selectedVariant: this.activeVariant,
        quantity: 1,
      };
      this.currentStore.cartItems = [...this.currentStore.cartItems, cartItem];
      this.toast.show('Selected saree added', 'success');
    }
  }

  @action
  openEnquiry() {
    if (this._enquiryPending) return;
    this._enquiryPending = true;
    setTimeout(() => {
      this._enquiryPending = false;
    }, 1000);

    const product = this.product;
    const variant = this.activeVariant || product.variants[0];
    const productLink = `${window.location.origin}/product/${product.id}`;

    const lines = [
      `Hello Riyasri Silks, I'm inquiring about:`,
      ``,
      `*Product:* ${product.name}`,
      `*Variant:* ${variant.name}`,
      `*Price:* ₹${product.price}`,
      `*Link:* ${productLink}`,
    ];

    const message = lines.join('\n');

    window.open(
      `https://wa.me/${this.currentStore.whatsappNumber}?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  }
}
