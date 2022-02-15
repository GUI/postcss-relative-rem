// Based on https://github.com/cuth/postcss-pxtorem/blob/6.0.0/lib/pixel-unit-regex.js
const remRegex = /"[^"]+"|'[^']+'|url\([^)]+\)|var\([^)]+\)|(\d*\.?\d+)rem/g;

module.exports = (options = {}) => {
  const baseCssVariable = options.baseCssVariable || "--rem-relative-base";

  const remReplace = (match, remDigits) => {
    if (!remDigits) {
      return match;
    }

    const rems = parseFloat(remDigits);
    if (rems === 0) {
      return "0";
    }

    return `calc(${rems} * var(${baseCssVariable}))`;
  };

  return {
    postcssPlugin: "postcss-relative-rem",

    Declaration(decl) {
      if (decl.value.includes("rem")) {
        // eslint-disable-next-line no-param-reassign
        decl.value = decl.value.replace(remRegex, remReplace);
      }
    },
  };
};

module.exports.postcss = true;
