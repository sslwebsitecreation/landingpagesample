import { helper } from '@ember/component/helper';

export function sub([a, b]) {
  return a - b;
}

export default helper(sub);
