import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class ToastContainerComponent extends Component {
  @service toast;

  @action
  dismiss() {
    this.toast.clear();
  }
}
