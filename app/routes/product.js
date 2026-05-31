import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ProductDetailsRoute extends Route {
  @service currentStore;

  async model(params) {
    const product = this.currentStore.products.find(
      (p) => p.id === Number(params.product_id)
    );

    const relatedProducts = this.currentStore.products.filter(
      (p) => p.category_id === product.category_id && p.id !== product.id
    );

    return {
      product,
      relatedProducts,
    };
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    const colorParam = controller.color;
    if (colorParam) {
      const hex = colorParam.startsWith('#') ? colorParam : `#${colorParam}`;
      const variant = model.product.variants.find(
        (v) => v.hex.toUpperCase() === hex.toUpperCase()
      );
      if (variant) {
        controller.activeVariant = variant;
        return;
      }
    }
    controller.activeVariant = model.product.variants[0];
  }
}
