import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class SearchService extends Service {
  @service router;
  @service currentStore;

  // Search state
  @tracked query = '';
  @tracked selectedCategory = null;
  @tracked selectedTags = [];

  // UI state
  @tracked showFilterModal = false;
  @tracked showMobileSearch = false;

  // Optional search debounce timer
  _searchTimeout = null;

  /**
   * Categories from store
   */
  get categories() {
    return this.currentStore.categories || [];
  }

  /**
   * Tags from store
   */
  get tags() {
    return this.currentStore.tags || [];
  }

  /**
   * Normalized query
   */
  get normalizedQuery() {
    return this.query.trim().toLowerCase();
  }

  /**
   * Category suggestions
   */
  get categorySuggestions() {
    const q = this.normalizedQuery;

    if (!q) {
      return this.categories;
    }

    return this.categories.filter((category) =>
      category?.name?.toLowerCase().includes(q)
    );
  }

  /**
   * Tag suggestions
   */
  get tagSuggestions() {
    const q = this.normalizedQuery;

    if (!q) {
      return this.tags;
    }

    return this.tags.filter((tag) =>
      tag?.toLowerCase().includes(q)
    );
  }

  /**
   * Select category
   */
  @action
  selectCategory(category) {
    this.selectedCategory = category;
  }

  /**
   * Clear category
   */
  @action
  clearCategory() {
    this.selectedCategory = null;
  }

  /**
   * Toggle tag selection
   */
  @action
  toggleTag(tag) {
    if (!tag) {
      return;
    }

    if (this.selectedTags.includes(tag)) {
      this.selectedTags = this.selectedTags.filter(
        (t) => t !== tag
      );
    } else {
      this.selectedTags = [...this.selectedTags, tag];
    }
  }

  /**
   * Remove tag
   */
  @action
  removeTag(tag) {
    this.selectedTags = this.selectedTags.filter(
      (t) => t !== tag
    );
  }

  /**
   * Clear all tags
   */
  @action
  clearTags() {
    this.selectedTags = [];
  }

  /**
   * Clear all search filters
   */
  @action
  clearAll() {
    this.query = '';
    this.selectedCategory = null;
    this.selectedTags = [];
  }

  /**
   * Build query params
   */
  buildQueryParams() {
    const params = {};

    const query = this.query.trim();

    if (query) {
      params.q = query;
    }

    if (this.selectedCategory?.name) {
      params.category = this.selectedCategory.name;
    }

    if (this.selectedTags.length) {
      params.tags = this.selectedTags.join(',');
    }

    return params;
  }

  /**
   * Execute search
   */
  @action
  performSearch() {
    const params = this.buildQueryParams();

    // Close UI overlays
    this.showFilterModal = false;
    this.showMobileSearch = false;

    this.router.transitionTo('collections', {
      queryParams: params,
    });
  }

  /**
   * Optional debounced search
   */
  @action
  debouncedSearch(delay = 300) {
    if (this._searchTimeout) {
      clearTimeout(this._searchTimeout);
    }

    this._searchTimeout = setTimeout(() => {
      this.performSearch();
    }, delay);
  }

  /**
   * Open filter modal
   */
  @action
  openFilterModal() {
    this.showFilterModal = true;
  }

  /**
   * Close filter modal
   */
  @action
  closeFilterModal() {
    this.showFilterModal = false;
  }

  /**
   * Open mobile search
   */
  @action
  openMobileSearch() {
    this.showMobileSearch = true;
  }

  /**
   * Close mobile search
   */
  @action
  closeMobileSearch() {
    this.showMobileSearch = false;
  }

  /**
   * Cleanup
   */
  willDestroy() {
    super.willDestroy?.();

    if (this._searchTimeout) {
      clearTimeout(this._searchTimeout);
      this._searchTimeout = null;
    }
  }
}