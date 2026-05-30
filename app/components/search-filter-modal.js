import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class SearchFilterModalComponent extends Component {
  @service search;

  @tracked categoryInputFocused = false;

  @tracked localQuery = '';
  @tracked categoryQuery = '';

  @tracked categoryBlurTimeout = null;

  @tracked pendingTags = [];
  @tracked appliedTags = [];
  @tracked isTagsOpen = false;

  constructor() {
    super(...arguments);

    this.localQuery = this.search.query || '';

    if (this.search.selectedCategory) {
      this.categoryQuery = this.search.selectedCategory.name;
    }

    this.pendingTags = [...this.search.selectedTags];
    this.appliedTags = [...this.search.selectedTags];
  }

  get isMobile() {
    return this.args.position === 'mobile';
  }

  get filteredCategories() {
    const query = this.categoryQuery.toLowerCase().trim();

    if (!query) {
      return this.search.categories || [];
    }

    return (this.search.categories || []).filter((category) =>
      category.name.toLowerCase().includes(query)
    );
  }

  @action
  handleSearchInput(event) {
    this.localQuery = event.target.value;
    this.search.query = this.localQuery;
  }

  @action
  handleCategoryInput(event) {
    this.categoryQuery = event.target.value;
    this.categoryInputFocused = true;
  }

  @action
  clearLocalSearch() {
    this.localQuery = '';
    this.search.query = '';
  }

  @action
  selectCategory(category) {
    this.search.selectCategory(category);

    this.categoryQuery = category.name;

    this.categoryInputFocused = false;
  }

  @action
  clearCategory(event) {
    event.preventDefault();

    if (typeof this.search.clearCategory === 'function') {
      this.search.clearCategory();
    } else {
      this.search.selectedCategory = null;
    }

    this.categoryQuery = '';
  }

  @action
  toggleTagsPanel() {
    if (!this.isTagsOpen) {
      this.pendingTags = [...this.appliedTags];
    }
    this.isTagsOpen = !this.isTagsOpen;
  }

  @action
  toggleTag(tag) {
    if (this.pendingTags.includes(tag)) {
      this.pendingTags = this.pendingTags.filter((t) => t !== tag);
    } else {
      this.pendingTags = [...this.pendingTags, tag];
    }
  }

  @action
  applyTags() {
    this.appliedTags = [...this.pendingTags];
    this.search.selectedTags = [...this.appliedTags];
    this.isTagsOpen = false;
  }

  @action
  removeTag(tag) {
    this.appliedTags = this.appliedTags.filter((t) => t !== tag);
    this.pendingTags = [...this.appliedTags];
    this.search.selectedTags = this.search.selectedTags.filter((t) => t !== tag);
  }

  @action
  performSearch() {
    this.search.query = this.localQuery;
    this.search.selectedTags = [...this.appliedTags];
    this.search.performSearch();

    if (typeof this.args.onClose === 'function') {
      this.args.onClose();
    }
  }

  @action
  handleSearchKeyDown(event) {
    if (event.key === 'Enter') {
      this.performSearch();
    }
  }

  @action
  handleCategoryBlur() {
    this.categoryBlurTimeout = setTimeout(() => {
      this.categoryInputFocused = false;
      this.categoryBlurTimeout = null;
    }, 150);
  }

  @action
  handleCategoryFocus() {
    if (this.categoryBlurTimeout) {
      clearTimeout(this.categoryBlurTimeout);
      this.categoryBlurTimeout = null;
    }

    this.categoryInputFocused = true;
  }

  @action
  clearAll() {
    this.localQuery = '';
    this.pendingTags = [];
    this.appliedTags = [];
    this.categoryQuery = '';
    this.isTagsOpen = false;
    this.search.clearAll();
  }

  @action
  stopPropagation(event) {
    event.stopPropagation();
  }
}