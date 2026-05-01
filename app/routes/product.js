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
    controller.activeVariant = model.product.variants[0];
  }
}
