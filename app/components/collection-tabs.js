import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class CollectionTabsComponent extends Component {
  @service currentStore;
  @tracked activeTab = 'Trending'; // 'Trending' or 'Special'

  get activeCollection() {
    return this.activeTab === 'Trending'
      ? this.currentStore.trendingSarees
      : this.currentStore.specialCollectionSarees;
  }

  @action
  setTab(tab) {
    this.activeTab = tab;
  }
}
