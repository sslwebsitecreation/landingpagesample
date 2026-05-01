import { helper } from '@ember/component/helper';

export default helper(function gte([left, right]) {
  return Number(left) >= Number(right);
});
