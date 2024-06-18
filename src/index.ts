import type { PluginCreator } from "postcss";

// Based on:
// https://github.com/hemengke1997/postcss-pxtorem/blob/v1.5.0/src/utils/pixel-unit-regex.ts
// https://github.com/cuth/postcss-pxtorem/blob/6.0.0/lib/pixel-unit-regex.js
const remRegex = /"[^"]+"|'[^']+'|url\([^)]+\)|--[\w-]+|(-?\d*\.?\d+)rem/gi;

export type pluginOptions = {
  baseCssVariable?: string;
};

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
  const options: pluginOptions = Object.assign(
    {
      baseCssVariable: "--rem-relative-base",
    },
    opts,
  );

  const remReplace = (match: string, remDigits: string) => {
    if (!remDigits) {
      return match;
    }

    const rems = parseFloat(remDigits);
    if (rems === 0) {
      return "0";
    }

    return `calc(${rems} * var(${options.baseCssVariable}))`;
  };

  return {
    postcssPlugin: "postcss-relative-rem",

    Declaration(decl) {
      if (/rem/i.test(decl.value)) {
        decl.value = decl.value.replace(remRegex, remReplace);
      }
    },
  };
};

creator.postcss = true;

export default creator;
