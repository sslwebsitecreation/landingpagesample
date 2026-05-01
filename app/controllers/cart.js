import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class CartController extends Controller {
  @service currentStore;

  whatsappNumber = '919876543210';

  get subtotal() {
    return this.currentStore.cartItems.reduce(
      (acc, item) => acc + (parseFloat(item.price) || 0) * (item.quantity || 1),
      0
    );
  }

  @action
  removeItem(index) {
    const items = [...this.currentStore.cartItems];
    items.splice(index, 1);
    this.currentStore.cartItems = items;
  }

  @action
  increaseQty(index) {
    const items = [...this.currentStore.cartItems];
    items[index].quantity = (items[index].quantity || 1) + 1;
    this.currentStore.cartItems = items;
  }

  @action
  decreaseQty(index) {
    const items = [...this.currentStore.cartItems];
    if (items[index].quantity > 1) {
      items[index].quantity--;
      this.currentStore.cartItems = items;
    }
  }

  @action
  sendToWhatsApp() {
    const items = this.currentStore.cartItems;
    if (items.length === 0) return;

    let message = `*New Order Inquiry For Riya Sri Silks*%0A%0A`;

    items.forEach((item, index) => {
      const qty = item.quantity || 1;
      const variant = item.selectedVariant ? item.selectedVariant.name : '';
      const productLink = `${window.location.origin}/product/${item.id}`;
      const lineTotal = (parseFloat(item.price) || 0) * qty;

      message += `*${index + 1}. ${item.name}*%0A`;
      if (variant) {
        message += `Variant: ${variant}%0A`;
      }
      message += `Qty: ${qty} × ₹${item.price} = ₹${lineTotal}%0A`;
      message += `Link: ${productLink}%0A%0A`;
    });

    message += `*Total Estimate: ₹${this.subtotal}* (Excl. Shipping)%0A%0A`;
    message += `Is this available?`;

    const whatsappUrl = `https://wa.me/${this.whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  }
}
