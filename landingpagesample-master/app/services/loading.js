import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class LoadingService extends Service {
  // Number of active loading operations
  _loadingCount = 0;

  // Reactive loading state
  @tracked isLoading = false;

  /**
   * Start loading
   * Supports multiple parallel requests safely
   */
  @action
  startLoading() {
    this._loadingCount++;

    if (!this.isLoading) {
      this.isLoading = true;
    }
  }

  /**
   * Stop loading
   * Prevents negative counter issues
   */
  @action
  stopLoading() {
    if (this._loadingCount > 0) {
      this._loadingCount--;
    }

    if (this._loadingCount === 0) {
      this.isLoading = false;
    }
  }

  /**
   * Force reset loading state
   * Useful during route transitions/errors
   */
  @action
  reset() {
    this._loadingCount = 0;
    this.isLoading = false;
  }

  /**
   * Optional helper
   * Wrap async operations automatically
   *
   * Example:
   * await this.loading.withLoading(async () => {
   *   await fetchData();
   * });
   */
  async withLoading(callback) {
    this.startLoading();

    try {
      return await callback();
    } finally {
      this.stopLoading();
    }
  }
}