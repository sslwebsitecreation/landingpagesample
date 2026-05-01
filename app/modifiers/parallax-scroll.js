import Modifier from 'ember-modifier';
import { registerDestructor } from '@ember/destroyable';

export default class ParallaxScrollModifier extends Modifier {
  handleScroll = null;

  modify(element, _positional, named) {
    this.cleanup();

    const speed = named.speed || 0.3;
    const direction = named.direction || 'vertical';

    this.handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const visibleProgress =
        (windowHeight - rect.top) / (windowHeight + rect.height);

      const clampedProgress = Math.min(Math.max(visibleProgress, 0), 1);
      const offset = (clampedProgress - 0.5) * speed * 100;

      if (direction === 'vertical') {
        element.style.transform = `translateY(${offset}px)`;
      } else if (direction === 'horizontal') {
        element.style.transform = `translateX(${offset}px)`;
      } else if (direction === 'scale') {
        const scale = 0.95 + clampedProgress * 0.1;
        element.style.transform = `scale(${scale})`;
      }
    };

    window.addEventListener('scroll', this.handleScroll, { passive: true });
    this.handleScroll();

    registerDestructor(this, () => this.cleanup());
  }

  cleanup() {
    if (this.handleScroll) {
      window.removeEventListener('scroll', this.handleScroll);
      this.handleScroll = null;
    }
  }
}
