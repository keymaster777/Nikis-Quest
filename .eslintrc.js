module.exports = {
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": "eslint:recommended",
  "overrides": [
  ],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "globals": {
    "global": true,
    "input": true,
    "ctx": true,
    "imgs": true,
    "player": true,
    "level": true,
    "overlayManager": true,
    "activeRoom": true,
    "freeCam": true,
    "deathCount": true,
  },
  "ignorePatterns": [
    "/dist/*.js",
    "/webpack.config.js",
    "/.eslintrc.js"
  ],
  "rules": {
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "double"
    ],
    "semi": [
      "error",
      "never"
    ],
    "eqeqeq": "error",
    'no-trailing-spaces': 'error',
    'object-curly-spacing': [
      'error', 'always'
    ],
    'arrow-spacing': [
      'error', { 'before': true, 'after': true }
    ]
  }
}
