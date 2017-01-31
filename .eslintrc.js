module.exports = {
  extends: 'airbnb-base',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'script',
    ecmaFeatures: {
      modules: false,
    },
  },
  rules: {
    'consistent-return': 0,
    'no-console': 1,
    'no-param-reassign': 0,
    strict: [2, 'global'],
  },
};
