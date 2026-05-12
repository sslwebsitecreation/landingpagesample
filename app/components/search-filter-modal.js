import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class SearchFilterModalComponent extends Component {
  @service search;

  @tracked categoryInputFocused = false;
  @tracked tagInputFocused = false;

  @tracked localQuery = '';
  @tracked categoryQuery = '';
  @tracked tagQuery = '';

  @tracked categoryBlurTimeout = null;
  @tracked tagBlurTimeout = null;

  constructor() {
    super(...arguments);

    this.localQuery = this.search.query || '';

    if (this.search.selectedCategory) {
      this.categoryQuery = this.search.selectedCategory.name;
    }
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

  get filteredTags() {
    const query = this.tagQuery.toLowerCase().trim();

    if (!query) {
      return this.search.tags || [];
    }

    return (this.search.tags || []).filter((tag) =>
      tag.toLowerCase().includes(query)
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
  handleTagInput(event) {
    this.tagQuery = event.target.value;
    this.tagInputFocused = true;
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
  toggleTag(tag) {
    this.search.toggleTag(tag);

    this.tagQuery = '';
  }

  @action
  removeTag(tag) {
    this.search.removeTag(tag);
  }

  @action
  performSearch() {
    this.search.query = this.localQuery;
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
  handleTagBlur() {
    this.tagBlurTimeout = setTimeout(() => {
      this.tagInputFocused = false;
      this.tagBlurTimeout = null;
    }, 150);
  }

  @action
  handleTagFocus() {
    if (this.tagBlurTimeout) {
      clearTimeout(this.tagBlurTimeout);
      this.tagBlurTimeout = null;
    }

    this.tagInputFocused = true;
  }

  @action
  stopPropagation(event) {
    event.stopPropagation();
  }
}