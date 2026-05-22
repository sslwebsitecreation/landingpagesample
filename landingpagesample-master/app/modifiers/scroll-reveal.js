import Modifier from 'ember-modifier';
import { registerDestructor } from '@ember/destroyable';

export default class ScrollRevealModifier extends Modifier {
  observer = null;

  modify(element, _positional, named) {
    this.cleanup();

    const delay = named.delay || 0;
    const threshold = named.threshold || 0.1;
    const rootMargin = named.rootMargin || '0px 0px -50px 0px';
    const once = named.once !== false;

    const direction = named.direction || '';
    if (direction) {
      element.classList.add(`scroll-reveal--hidden`, `from-${direction}`);
    } else {
      element.classList.add('scroll-reveal--hidden');
    }

    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          if (delay > 0) {
            setTimeout(() => {
              el.classList.add('scroll-reveal--visible');
            }, delay);
          } else {
            el.classList.add('scroll-reveal--visible');
          }

          if (once) {
            this.observer.unobserve(el);
          }
        } else if (!once) {
          entry.target.classList.remove('scroll-reveal--visible');
        }
      });
    };

    this.observer = new IntersectionObserver(handleIntersect, {
      threshold,
      rootMargin,
    });

    this.observer.observe(element);

    registerDestructor(this, () => this.cleanup());
  }

  cleanup() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}
