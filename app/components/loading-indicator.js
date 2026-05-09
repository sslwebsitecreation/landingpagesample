import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class LoadingIndicatorComponent extends Component {
  @service currentStore;

  get isVisible() {
    return !this.currentStore.products.length;
  }
}
