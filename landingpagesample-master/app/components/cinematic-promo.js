import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class CinematicPromoComponent extends Component {
  element = null;

  // 1. Correctly decorate the setup method
  @action
  setup3DScroll(element) {
    this.element = element;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            window.addEventListener('scroll', this.handleScroll);
          } else {
            window.removeEventListener('scroll', this.handleScroll);
          }
        });
      },
      { threshold: 0 }
    );

    observer.observe(element);
  }

  // 2. Change handleScroll from an arrow function to a decorated method
  @action
  handleScroll() {
    if (!this.element) return;

    const rect = this.element.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Calculate progress (0 to 1)
    const progress = Math.min(
      Math.max((windowHeight - rect.top) / (windowHeight + rect.height), 0),
      1
    );

    // Map progress to 3D values
    const tilt = (progress - 0.5) * 30;
    const scale = 0.9 + progress * 0.2;

    // Update CSS variables directly on the element
    this.element.style.setProperty('--scroll-tilt', `${tilt}deg`);
    this.element.style.setProperty('--scroll-scale', `${scale}`);
    this.element.style.setProperty('--scroll-progress', progress);
  }

  // 3. Clean up listener when component is destroyed
  willDestroy() {
    super.willDestroy(...arguments);
    window.removeEventListener('scroll', this.handleScroll);
  }
}
