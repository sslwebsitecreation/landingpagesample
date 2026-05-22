import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class IndexController extends Controller {
  @service currentStore;
  @tracked isCategoryModalOpen = false;

  @action
  openCategoryModal() {
    this.isCategoryModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  @action
  closeCategoryModal() {
    this.isCategoryModalOpen = false;
    document.body.style.overflow = '';
  }

  @action
  stopPropagation(event) {
    event.stopPropagation();
  }
}
