import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { later } from '@ember/runloop';
import { inject as service } from '@ember/service';

export default class HandpickedCollectionComponent extends Component {
  @service currentStore;

  @tracked activeIndex = 0;
  @tracked isTransitioning = false;
  @tracked showPreview = false;

  get sarees() {
    return (this.currentStore.handpickedSarees || []).slice(0, 5);
  }

  get activeSaree() {
    return this.sarees[this.activeIndex];
  }

  @action
  selectSaree(index) {
    if (this.activeIndex === index) return;
    this.isTransitioning = true;
    later(this, () => {
      this.activeIndex = index;
      later(this, () => {
        this.isTransitioning = false;
      }, 50);
    }, 300);
  }

  @action
  openPreview() {
    this.showPreview = true;
  }

  @action
  closePreview() {
    this.showPreview = false;
  }

  @action
  stopPropagation(e) {
    e.stopPropagation();
  }
}
