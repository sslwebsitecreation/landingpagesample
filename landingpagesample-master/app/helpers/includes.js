import { helper } from '@ember/component/helper';

export default helper(function includes([item, array]) {
  if (!array) return false;
  return array.includes(item);
});
