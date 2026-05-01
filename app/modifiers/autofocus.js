import { modifier } from 'ember-modifier';

export default modifier((element, [shouldFocus]) => {
  if (shouldFocus) {
    element.focus();
  }
});
