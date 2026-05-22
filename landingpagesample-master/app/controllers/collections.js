import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class CollectionsController extends Controller {
  @service currentStore;
  @service search;

  queryParams = ['q', 'category', 'tags'];

  @tracked q = '';
  @tracked category = '';
  @tracked tags = '';
  @tracked currentPage = 1;
  @tracked isCategoryOpen = false;
  @tracked isTagsOpen = false;
  @tracked pendingTags = [];
  @tracked pendingCategory = '';
  pageSize = 16;

  get parsedTags() {
    return this.tags ? this.tags.split(',').filter(Boolean) : [];
  }

  get activeFilterCount() {
    let count = 0;
    if (this.category) count++;
    count += this.parsedTags.length;
    return count;
  }

  get hasActiveFilters() {
    return this.activeFilterCount > 0;
  }

  get compactTagsDisplay() {
    const tagArr = this.parsedTags;
    if (tagArr.length === 0) return 'All';
    if (tagArr.length === 1) return tagArr[0];
    return `${tagArr[0]} +${tagArr.length - 1}`;
  }

  get effectivePendingCategory() {
    return this.pendingCategory || this.category || '';
  }

  get filteredProducts() {
    let products = this.currentStore.products || [];

    if (this.q) {
      const query = this.q.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    if (this.category) {
      const cat = this.category.toLowerCase();
      products = products.filter((p) => {
        const productCat = this.currentStore.categories.find(
          (c) => c.category_id === p.category_id
        );
        return productCat && productCat.name.toLowerCase() === cat;
      });
    }

    if (this.parsedTags.length) {
      products = products.filter((p) => {
        const productTags = p.tags || [];
        return this.parsedTags.some((t) => productTags.includes(t));
      });
    }

    return products;
  }

  get totalPages() {
    return Math.ceil(this.filteredProducts.length / this.pageSize);
  }

  get paginatedProducts() {
    let start = (this.currentPage - 1) * this.pageSize;
    return this.filteredProducts.slice(start, start + this.pageSize);
  }

  get pages() {
    let pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  @action
  closeAllDropdowns() {
    this.isCategoryOpen = false;
    this.isTagsOpen = false;
    this.pendingTags = [...this.parsedTags];
    this.pendingCategory = this.category;
  }

  @action
  toggleAllFilters() {
    this.isCategoryOpen = !this.isCategoryOpen;
    this.isTagsOpen = !this.isTagsOpen;
  }

  @action
  toggleCategoryDropdown() {
    const wasOpen = this.isCategoryOpen;
    if (!wasOpen) {
      this.pendingCategory = this.category;
    }
    this.isCategoryOpen = !wasOpen;
    this.isTagsOpen = false;
  }

  @action
  selectPendingCategory(catName) {
    this.pendingCategory = catName;
  }

  @action
  applyCategoryFilter() {
    this.currentPage = 1;
    this.category = this.pendingCategory;
    this.isCategoryOpen = false;
  }

  @action
  toggleTagsDropdown() {
    const wasOpen = this.isTagsOpen;
    if (!wasOpen) {
      this.pendingTags = [...this.parsedTags];
    }
    this.isTagsOpen = !wasOpen;
    this.isCategoryOpen = false;
  }

  @action
  togglePendingTag(tag) {
    const currentTags = this.pendingTags;
    let newTags;
    if (currentTags.includes(tag)) {
      newTags = currentTags.filter((t) => t !== tag);
    } else {
      newTags = [...currentTags, tag];
    }
    this.pendingTags = newTags;
  }

  @action
  applyTagsFilter() {
    this.currentPage = 1;
    this.tags = this.pendingTags.join(',');
    this.isTagsOpen = false;
  }

  @action
  removeTagChip(tag) {
    this.currentPage = 1;
    const currentTags = this.parsedTags;
    const newTags = currentTags.filter((t) => t !== tag);
    this.tags = newTags.join(',');
  }

  @action
  clearSearch() {
    this.currentPage = 1;
    this.q = '';
  }

  @action
  clearAllFilters() {
    this.currentPage = 1;
    this.q = '';
    this.category = '';
    this.tags = '';
    this.pendingTags = [];
    this.pendingCategory = '';
    this.isCategoryOpen = false;
    this.isTagsOpen = false;
  }

  @action
  setPage(page) {
    this.currentPage = page;
    const grid = document.querySelector('.collections-grid');
    if (grid) {
      grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  @action
  changePage(step) {
    this.currentPage += step;
    const grid = document.querySelector('.collections-grid');
    if (grid) {
      grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
