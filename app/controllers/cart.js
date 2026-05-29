import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class CartController extends Controller {
  @service currentStore;
  @service toast;

  get subtotal() {
    return this.currentStore.cartItems.reduce(
      (acc, item) => acc + (parseFloat(item.price) || 0) * (item.quantity || 1),
      0
    );
  }

  @action
  removeItem(index) {
    const removed = this.currentStore.cartItems[index];
    this.currentStore.cartItems = this.currentStore.cartItems.filter(
      (_, i) => i !== index
    );
    this.toast.show(`${removed.name} removed`, 'info');
  }

  @action
  increaseQty(index) {
    this.currentStore.cartItems = this.currentStore.cartItems.map((item, i) => {
      if (i === index) {
        return { ...item, quantity: (item.quantity || 1) + 1 };
      }
      return item;
    });
    this.toast.show('Quantity updated', 'success');
  }

  @action
  decreaseQty(index) {
    const current = this.currentStore.cartItems[index];
    if (!current || current.quantity <= 1) return;

    this.currentStore.cartItems = this.currentStore.cartItems.map((item, i) => {
      if (i === index) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });
    this.toast.show('Quantity updated', 'success');
  }

  @action
  sendToWhatsApp() {
    if (this._waPending) return;
    this._waPending = true;
    setTimeout(() => {
      this._waPending = false;
    }, 1000);

    const items = this.currentStore.cartItems;
    if (items.length === 0) return;

    let message = `*New Order Inquiry For Riyasri Silks*%0A%0A`;

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

    const whatsappUrl = `https://wa.me/${this.currentStore.whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  }
}
