import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class SearchService extends Service {
  @service router;
  @service currentStore;

  @tracked query = '';
  @tracked selectedCategory = null;
  @tracked selectedTags = [];
  @tracked showFilterModal = false;
  @tracked showMobileSearch = false;

  get categories() {
    return this.currentStore.categories || [];
  }

  get tags() {
    return this.currentStore.tags || [];
  }

  get categorySuggestions() {
    if (!this.query) return this.categories;
    const q = this.query.toLowerCase();
    return this.categories.filter((c) => c.name.toLowerCase().includes(q));
  }

  get tagSuggestions() {
    if (!this.query) return this.tags;
    const q = this.query.toLowerCase();
    return this.tags.filter((t) => t.toLowerCase().includes(q));
  }

  @action
  selectCategory(category) {
    this.selectedCategory = category;
  }

  @action
  clearCategory() {
    this.selectedCategory = null;
  }

  @action
  toggleTag(tag) {
    if (this.selectedTags.includes(tag)) {
      this.selectedTags = this.selectedTags.filter((t) => t !== tag);
    } else {
      this.selectedTags = [...this.selectedTags, tag];
    }
  }

  @action
  removeTag(tag) {
    this.selectedTags = this.selectedTags.filter((t) => t !== tag);
  }

  @action
  clearTags() {
    this.selectedTags = [];
  }

  @action
  clearAll() {
    this.query = '';
    this.selectedCategory = null;
    this.selectedTags = [];
  }

  @action
  performSearch() {
    const params = {};
    if (this.query) params.q = this.query;
    if (this.selectedCategory) params.category = this.selectedCategory.name;
    if (this.selectedTags.length) params.tags = this.selectedTags.join(',');

    this.showFilterModal = false;
    this.showMobileSearch = false;

    this.router.transitionTo('collections', { queryParams: params });
  }

  @action
  openFilterModal() {
    this.showFilterModal = true;
  }

  @action
  closeFilterModal() {
    this.showFilterModal = false;
  }

  @action
  openMobileSearch() {
    this.showMobileSearch = true;
  }

  @action
  closeMobileSearch() {
    this.showMobileSearch = false;
  }
}
