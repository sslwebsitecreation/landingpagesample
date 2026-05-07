import Component from '@glimmer/component';
import { action } from '@ember/object';
import gsap from 'gsap';

export default class HeroFlowComponent extends Component {
  element = null;
  glow = null;

  @action
  setup(element) {
    this.element = element;
    this.glow = element.querySelector('.hero-banner-glow');

    window.addEventListener('scroll', this.onScroll, { passive: true });
    this.onScroll();

    window.addEventListener('mousemove', this.onMouseMove);
    element.addEventListener('mouseenter', this.onMouseEnter);
    element.addEventListener('mouseleave', this.onMouseLeave);
  }

  @action
  onScroll() {
    if (!this.element) return;
    const rect = this.element.getBoundingClientRect();
    const progress = Math.min(Math.max(-rect.top / window.innerHeight, 0), 1);
    const image = this.element.querySelector('.hero-banner-image');
    if (image) {
      image.style.transform = `translateY(${progress * 50}px)`;
    }
  }

  @action
  onMouseMove(e) {
    if (!this.glow) return;
    const rect = this.element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    gsap.to(this.glow, {
      x: x,
      y: y,
      duration: 1.2,
      ease: 'power2.out',
    });
  }

  @action
  onMouseEnter() {
    if (!this.glow) return;
    gsap.to(this.glow, { opacity: 1, duration: 0.5, ease: 'power2.out' });
  }

  @action
  onMouseLeave() {
    if (!this.glow) return;
    gsap.to(this.glow, { opacity: 0, duration: 0.7, ease: 'power2.out' });
  }

  willDestroy() {
    super.willDestroy(...arguments);
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('mousemove', this.onMouseMove);
    if (this.element) {
      this.element.removeEventListener('mouseenter', this.onMouseEnter);
      this.element.removeEventListener('mouseleave', this.onMouseLeave);
    }
  }
}
