/** @type {import("prettier").Config} */
const config = {
  printWidth: 80,
  tabWidth: 2,
  singleQuote: true,
  trailingComma: 'es5',
  semi: true,
  arrowParens: 'always',
  plugins: [require.resolve('prettier-plugin-tailwindcss')],
};

module.exports = config;
