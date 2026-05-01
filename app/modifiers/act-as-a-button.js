// app/modifiers/act-as-a-button.js
import { modifier } from 'ember-modifier';

export default modifier(function actAsAButton(element) {
  function handleKeyDown(event) {
    // Trigger native click so existing {{on "click"}} handles it
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      element.click();
    }
  }

  // Accessibility attributes
  element.setAttribute('role', 'button');
  element.setAttribute('tabindex', '0');

  element.addEventListener('keydown', handleKeyDown);

  // Cleanup
  return () => {
    element.removeEventListener('keydown', handleKeyDown);
  };
});
