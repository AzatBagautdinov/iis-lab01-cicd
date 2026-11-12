const globals = Object.fromEntries(['require','module','process','console','Buffer','__dirname','describe','test','expect','beforeAll','afterAll'].map(x => [x, 'readonly']));
module.exports = [{files: ['**/*.js'], languageOptions: {ecmaVersion: 2022, sourceType: 'commonjs', globals}, rules: {'no-undef': 'error', 'no-unused-vars': 'error', 'eqeqeq': 'error'}}];
