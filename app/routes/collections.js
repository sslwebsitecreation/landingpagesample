import Route from '@ember/routing/route';

export default class CollectionsRoute extends Route {
  queryParams = {
    q: { refreshModel: false },
    category: { refreshModel: false },
    tags: { refreshModel: false },
  };

  model(params) {
    return params;
  }
}
