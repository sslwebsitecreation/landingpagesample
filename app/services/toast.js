import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

let _nextId = 0;

export default class ToastService extends Service {
  @tracked _list = [];

  get toastList() {
    return this._list;
  }

  @action
  show(message, type = 'success') {
    this._list = [{ id: ++_nextId, message, type }];
    if (this._timeoutId) {
      clearTimeout(this._timeoutId);
    }
    this._timeoutId = setTimeout(() => {
      this.clear();
    }, 3000);
  }

  @action
  clear() {
    if (this._timeoutId) {
      clearTimeout(this._timeoutId);
      this._timeoutId = null;
    }
    this._list = [];
  }
}
