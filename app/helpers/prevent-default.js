import { helper } from '@ember/component/helper';

export default helper(function preventDefault([callback]) {
  return function (event) {
    event.preventDefault();
    if (callback) callback(event);
  };
});
