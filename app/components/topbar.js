import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class TopbarComponent extends Component {
  @service currentStore;
  @service search;
  @service router;

  @tracked desktopQuery = '';
  @tracked showMobileMenu = false;

  get isCollectionsRoute() {
    const routeName = this.router.currentRouteName || '';
    return routeName.includes('collections');
  }

  get currentQ() {
    const route = this.router.currentRoute;
    return route?.queryParams?.q || '';
  }

  get cartCount() {
    return this.currentStore.cartItems?.length || 0;
  }

  @action
  handleDesktopKeydown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.submitDesktopSearch();
    }
  }

  @action
  submitDesktopSearch() {
    const trimmed = this.desktopQuery.trim();
    this.search.query = trimmed;
    this.search.performSearch();
  }

  @action
  handleDesktopSearchSubmit(e) {
    e.preventDefault();
    this.submitDesktopSearch();
  }

  @action
  handleDesktopInputChange(e) {
    this.desktopQuery = e.target.value;
    if (!this.desktopQuery.trim() && this.isCollectionsRoute) {
      this.search.query = '';
      this.search.performSearch();
    }
  }

  @action
  clearSearch() {
    this.desktopQuery = '';
    this.search.query = '';
    this.search.performSearch();
  }

  @action
  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
  }

  @action
  navigateTo(route) {
    this.showMobileMenu = false;
    this.router.transitionTo(route);
  }
}
