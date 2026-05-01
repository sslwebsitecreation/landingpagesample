import { helper } from '@ember/component/helper';

export function take([count, array]) {
  if (!Array.isArray(array)) {
    return [];
  }
  return array.slice(0, count);
}

export default helper(take);
