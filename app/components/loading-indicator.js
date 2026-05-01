import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class LoadingIndicatorComponent extends Component {
  @service loading;
  @service currentStore;

  get isVisible() {
    return this.loading.isLoading || !this.currentStore.products.length;
  }
}
