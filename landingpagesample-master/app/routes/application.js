import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ApplicationRoute extends Route {
  @service router;
  @service currentStore;

  constructor() {
    super(...arguments);
    this.router.on('routeDidChange', () => {
      window.scrollTo(0, 0);
    });
  }

  beforeModel() {
    return this.currentStore.fetchStoreData();
  }
}
