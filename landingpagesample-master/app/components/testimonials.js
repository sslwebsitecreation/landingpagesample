import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

const testimonialsData = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'Mumbai',
    rating: 5,
    text: 'The silk quality is extraordinary. My Kanjeevaram arrived beautifully packaged and the colors are even more vibrant in person. A truly premium experience.',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
  },
  {
    id: 2,
    name: 'Anita Reddy',
    location: 'Bangalore',
    rating: 5,
    text: 'I ordered a Banarasi for my wedding and it exceeded all expectations. The craftsmanship and attention to detail is remarkable. Will definitely be ordering again.',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
  },
  {
    id: 3,
    name: 'Deepa Krishnan',
    location: 'Chennai',
    rating: 4,
    text: "Beautiful Patola saree with intricate weaving. The customer service team helped me choose the perfect piece for my mother's anniversary. Highly recommended.",
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
  },
  {
    id: 4,
    name: 'Meera Patel',
    location: 'Delhi',
    rating: 5,
    text: 'The linen collection is perfect for everyday elegance. Light, breathable, and the prints are so elegant. My go-to store for quality sarees now.',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
  },
];

export default class TestimonialsComponent extends Component {
  @tracked activeIndex = 0;

  get testimonials() {
    return testimonialsData;
  }

  @action
  setActive(index) {
    this.activeIndex = index;
  }

  @action
  nextTestimonial() {
    this.activeIndex = (this.activeIndex + 1) % this.testimonials.length;
  }

  @action
  prevTestimonial() {
    this.activeIndex =
      (this.activeIndex - 1 + this.testimonials.length) %
      this.testimonials.length;
  }
}
