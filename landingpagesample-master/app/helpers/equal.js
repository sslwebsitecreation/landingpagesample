// app/helpers/equal.js
import { helper } from '@ember/component/helper';

export default helper(function equal([left, right]) {
  return left === right;
});
