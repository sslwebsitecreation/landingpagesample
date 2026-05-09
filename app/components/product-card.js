import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ProductCardComponent extends Component {
  @service currentStore;
  @service toast;
  @tracked activeVariant = this.args.product.variants?.[0] || {};

  get stockClass() {
    return this.args.product.stockStatus?.replace('_', '-') || 'in-stock';
  }

  @action
  selectVariant(variant, event) {
    // Stops the card's LinkTo from triggering
    event.preventDefault();
    event.stopPropagation();
    this.activeVariant = variant;
  }

  @action
  addToCart(product, event) {
    event.preventDefault();
    event.stopPropagation();
    const existing = this.currentStore.cartItems.find(
      (item) => item.id === product.id
    );
    if (existing) {
      this.currentStore.cartItems = this.currentStore.cartItems.map((item) => {
        if (item.id === product.id) {
          return { ...item, quantity: (item.quantity || 1) + 1 };
        }
        return item;
      });
      this.toast.show('Quantity updated', 'success');
    } else {
      const cartItem = {
        ...product,
        selectedVariant: this.activeVariant,
        quantity: 1,
      };
      this.currentStore.cartItems = [...this.currentStore.cartItems, cartItem];
      this.toast.show('Selected saree added', 'success');
    }
  }
}
