import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class LoadingService extends Service {
  @tracked isAppLoading = false;

  @action
  startLoading() {
    this.isAppLoading = true;
  }

  @action
  stopLoading() {
    this.isAppLoading = false;
  }
}
