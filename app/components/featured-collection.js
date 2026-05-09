import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { later } from '@ember/runloop';
import { inject as service } from '@ember/service';

export default class FeaturedCollectionComponent extends Component {
  @service currentStore;
  @service toast;

  @tracked activeSaree = this.currentStore.handpickedSarees?.[0] || null;
  @tracked isSwapping = false;

  @action
  selectSaree(saree) {
    if (this.activeSaree?.id === saree.id) {
      if (window.innerWidth <= 1024) this.activeSaree = null;
      return;
    }

    this.isSwapping = true;

    later(
      this,
      () => {
        this.activeSaree = saree;
        later(
          this,
          () => {
            this.isSwapping = false;
          },
          50
        );
      },
      400
    );
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
