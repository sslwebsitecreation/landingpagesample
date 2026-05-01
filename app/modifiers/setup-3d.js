// app/modifiers/setup-3d.js
import { modifier } from 'ember-modifier';

export default modifier((element, [setupFn]) => {
  if (typeof setupFn === 'function') {
    setupFn(element);
  }

  return () => {
    // This cleanup runs when the component is destroyed
    console.log('Cleaning up 3D resources...');
  };
});
