import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class SearchFilterModalComponent extends Component {
  @service search;
  @tracked categoryInputFocused = false;
  @tracked tagInputFocused = false;
  @tracked localQuery = '';
  @tracked pendingBlur = null;

  get isMobile() {
    return this.args.position === 'mobile';
  }

  get filteredCategories() {
    const q = this.localQuery.toLowerCase();
    if (!q) return this.search.categories;
    return this.search.categories.filter((c) =>
      c.name.toLowerCase().includes(q)
    );
  }

  get filteredTags() {
    const q = this.localQuery.toLowerCase();
    if (!q) return this.search.tags;
    return this.search.tags.filter((t) => t.toLowerCase().includes(q));
  }

  @action
  handleLocalInput(e) {
    this.localQuery = e.target.value;
    this.search.query = this.localQuery;
  }

  @action
  clearLocalSearch() {
    this.localQuery = '';
    this.search.query = '';
  }

  @action
  selectCategory(category) {
    this.search.selectCategory(category);
    this.localQuery = '';
    this.categoryInputFocused = false;
  }

  @action
  toggleTag(tag) {
    this.search.toggleTag(tag);
  }

  @action
  removeTag(tag) {
    this.search.removeTag(tag);
  }

  @action
  performSearch() {
    this.search.query = this.localQuery;
    this.search.performSearch();
  }

  @action
  handleKeyDown(e) {
    if (e.key === 'Enter') {
      this.performSearch();
    }
  }

  @action
  handleCategoryBlur() {
    this.pendingBlur = setTimeout(() => {
      this.categoryInputFocused = false;
      this.pendingBlur = null;
    }, 150);
  }

  @action
  handleCategoryFocus() {
    if (this.pendingBlur) {
      clearTimeout(this.pendingBlur);
      this.pendingBlur = null;
    }
    this.categoryInputFocused = true;
  }

  @action
  handleTagBlur() {
    this.pendingBlur = setTimeout(() => {
      this.tagInputFocused = false;
      this.pendingBlur = null;
    }, 150);
  }

  @action
  handleTagFocus() {
    if (this.pendingBlur) {
      clearTimeout(this.pendingBlur);
      this.pendingBlur = null;
    }
    this.tagInputFocused = true;
  }

  @action
  stopPropagation(e) {
    e.stopPropagation();
  }
}
