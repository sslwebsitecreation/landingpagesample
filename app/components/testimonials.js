import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

const testimonialsData = [
  {
    id: 1,
    name: 'Lakshmi',
    location: 'Coimbatore',
    rating: 5,
    text: 'I ordered Kanjeevaram for my daughter wedding. Quality is very good. All my relatives asked where I bought. Definitely I will order again.',
    avatar: '/images/review1.jpg',
  },
  {
    id: 2,
    name: 'Sundari',
    location: 'Madurai',
    rating: 5,
    text: 'I bought Banarasi saree for Diwali. Wonderful product. Colour exactly matching the photo. My husband also liked it very much. Thank you Riya Silks.',
    avatar: '/images/review2.jpg',
  },
  {
    id: 3,
    name: 'Meenakshi',
    location: 'Chennai',
    rating: 5,
    text: 'The Patola saree I ordered for my mother anniversary is so beautiful. Weight also perfect. Very happy with the purchase.',
    avatar: '/images/review3.jpg',
  },
  {
    id: 4,
    name: 'Rajeshwari',
    location: 'Trichy',
    rating: 5,
    text: 'First time ordering saree online. I was little nervous but when I opened the parcel I was very happy. Linen saree is very comfortable. Surely I will buy more.',
    avatar: '/images/review4.jpg',
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
