import { helper } from '@ember/component/helper';

export default helper(function categoryCount([category, products]) {
  if (!category || !products) return 0;
  return products.filter((p) => p.category_id === category.category_id).length;
});
