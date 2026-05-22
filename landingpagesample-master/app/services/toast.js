import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

let _nextId = 0;

export default class ToastService extends Service {
  // Active toast list
  @tracked _list = [];

  // Timeout reference
  _timeoutId = null;

  /**
   * Public getter
   */
  get toastList() {
    return this._list;
  }

  /**
   * Show toast
   *
   * @param {string} message
   * @param {string} type
   * @param {number} duration
   */
  @action
  show(message, type = 'success', duration = 3000) {
    // Prevent invalid toast
    if (!message || typeof message !== 'string') {
      return;
    }

    const toast = {
      id: ++_nextId,
      message,
      type,
    };

    // Single-toast mode
    this._list = [toast];

    // Clear existing timer
    this._clearTimer();

    // Auto-dismiss
    this._timeoutId = setTimeout(() => {
      this.clear();
    }, duration);
  }

  /**
   * Clear all toasts
   */
  @action
  clear() {
    this._clearTimer();
    this._list = [];
  }

  /**
   * Remove toast by id
   * Useful if future multi-toast support added
   */
  @action
  remove(id) {
    this._list = this._list.filter((toast) => toast.id !== id);

    if (this._list.length === 0) {
      this._clearTimer();
    }
  }

  /**
   * Clear timeout safely
   */
  _clearTimer() {
    if (this._timeoutId) {
      clearTimeout(this._timeoutId);
      this._timeoutId = null;
    }
  }

  /**
   * Cleanup on destroy
   */
  willDestroy() {
    super.willDestroy?.();
    this._clearTimer();
  }
}