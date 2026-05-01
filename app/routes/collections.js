import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class CollectionsRoute extends Route {
  @service currentStore;
  @service loading;

  queryParams = {
    q: { refreshModel: false },
    category: { refreshModel: false },
    tags: { refreshModel: false },
  };

  beforeModel() {
    this.loading.startLoading();
    return this.currentStore.fetchStoreData();
  }

  afterModel() {
    this.loading.stopLoading();
  }

  model(params) {
    return params;
  }
}
