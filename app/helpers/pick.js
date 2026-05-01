import { helper } from '@ember/component/helper';

export default helper(function pick([path, callback]) {
  return function (event) {
    const value = path.split('.').reduce((obj, key) => obj?.[key], event);
    callback(value);
  };
});
