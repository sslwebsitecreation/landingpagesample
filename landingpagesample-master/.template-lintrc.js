'use strict';

module.exports = {
  extends: 'recommended',
  rules: {
    'no-invalid-interactive': {
      additionalInteractiveTags: ['div'],
    },
    'no-inline-styles': false,
    'style-concatenation': false,
  },
};
