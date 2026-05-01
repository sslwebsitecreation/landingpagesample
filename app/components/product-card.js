import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ProductCardComponent extends Component {
  @service currentStore; // Assuming you have a cart service
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
      existing.quantity = (existing.quantity || 1) + 1;
      this.currentStore.cartItems = [...this.currentStore.cartItems];
    } else {
      const cartItem = {
        ...product,
        selectedVariant: this.activeVariant,
        quantity: 1,
      };
      this.currentStore.cartItems = [...this.currentStore.cartItems, cartItem];
    }
  }
}
