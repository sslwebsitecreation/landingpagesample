import { helper } from '@ember/component/helper';

export default helper(function add(params) {
  return params.reduce((sum, value) => {
    return sum + Number(value || 0);
  }, 0);
});
