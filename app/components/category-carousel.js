import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class CategoryCarouselComponent extends Component {
  @service currentStore;

  @tracked isMobile = false;

  get categoryCount() {
    return this.currentStore.categories?.length || 0;
  }

  get showArrows() {
    return this.isMobile || this.categoryCount > 6;
  }

  @action
  setupCarousel(element) {
    this._track = element;
    this._updateViewport();
    window.addEventListener('resize', this._updateViewport);
    this._startAutoScroll();
  }

  willDestroy() {
    super.willDestroy(...arguments);
    window.removeEventListener('resize', this._updateViewport);
    this._stopAutoScroll();
  }

  _updateViewport = () => {
    this.isMobile = window.innerWidth <= 768;
  }

  _startAutoScroll() {
    this._stopAutoScroll();
    this._autoInterval = setInterval(() => {
      this._autoScroll();
    }, 4000);
  }

  _stopAutoScroll() {
    if (this._autoInterval) {
      clearInterval(this._autoInterval);
      this._autoInterval = null;
    }
  }

  _autoScroll() {
    if (!this._track || this._userInteracting) return;
    const { scrollLeft, scrollWidth, clientWidth } = this._track;
    if (scrollLeft + clientWidth >= scrollWidth - 2) {
      this._track.scrollTo({ left: 0, behavior: 'smooth' });
      return;
    }
    const card = this._track.querySelector('.category-card');
    const step = card ? card.offsetWidth + 28 : 300;
    this._track.scrollBy({ left: step, behavior: 'smooth' });
  }

  @action
  handleInteraction() {
    this._userInteracting = true;
    this._stopAutoScroll();
  }

  @action
  handleScrollEnd() {
    if (this._userInteracting) return;
  }

  @action
  scrollPrev() {
    this.handleInteraction();
    if (!this._track) return;
    const card = this._track.querySelector('.category-card');
    const step = card ? card.offsetWidth + 28 : 300;
    this._track.scrollBy({ left: -step, behavior: 'smooth' });
  }

  @action
  scrollNext() {
    this.handleInteraction();
    if (!this._track) return;
    const card = this._track.querySelector('.category-card');
    const step = card ? card.offsetWidth + 28 : 300;
    this._track.scrollBy({ left: step, behavior: 'smooth' });
  }
}
