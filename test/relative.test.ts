import { expect, test } from "vitest";
import postcssRelativeRem from "../src";
import postcss from "postcss";

test("basic rem replacement", () => {
  const input = ".rule { font-size: 2rem }";
  const processed = postcss(postcssRelativeRem()).process(input).css;

  expect(processed).toEqual(
    ".rule { font-size: calc(2 * var(--rem-relative-base)) }",
  );
});

test("rem unit is matched case insenitively", () => {
  const input = ".rule { font-size: 2REM; padding: 1ReM; margin: 3.4rEm; }";
  const processed = postcss(postcssRelativeRem()).process(input).css;

  expect(processed).toEqual(
    ".rule { font-size: calc(2 * var(--rem-relative-base)); padding: calc(1 * var(--rem-relative-base)); margin: calc(3.4 * var(--rem-relative-base)); }",
  );
});

test("decimal rem values", () => {
  const input = ".rule { font-size: 0.589rem }";
  const processed = postcss(postcssRelativeRem()).process(input).css;

  expect(processed).toEqual(
    ".rule { font-size: calc(0.589 * var(--rem-relative-base)) }",
  );
});

test("decimal rem values without 0 prefix", () => {
  const input = ".rule { font-size: .5rem }";
  const processed = postcss(postcssRelativeRem()).process(input).css;

  expect(processed).toEqual(
    ".rule { font-size: calc(0.5 * var(--rem-relative-base)) }",
  );
});

test("multiple rem values", () => {
  const input = "kbd { padding: 0.1875rem 0.375rem; border-radius: 18.25rem; }";
  const processed = postcss(postcssRelativeRem()).process(input).css;

  expect(processed).toEqual(
    "kbd { padding: calc(0.1875 * var(--rem-relative-base)) calc(0.375 * var(--rem-relative-base)); border-radius: calc(18.25 * var(--rem-relative-base)); }",
  );
});

test("negative rem values", () => {
  const input = ".rule { margin-top: -1rem }";
  const processed = postcss(postcssRelativeRem()).process(input).css;

  expect(processed).toEqual(
    ".rule { margin-top: calc(-1 * var(--rem-relative-base)) }",
  );
});

test("variables with rem value", () => {
  const input = ".row { --bs-gutter-x: 1.5rem; }";
  const processed = postcss(postcssRelativeRem()).process(input).css;

  expect(processed).toEqual(
    ".row { --bs-gutter-x: calc(1.5 * var(--rem-relative-base)); }",
  );
});

test("variable with default value containing rem units", () => {
  const input =
    ":root { --example-2rem: 1rem; } .rule { font-size: var(--example-2rem, 3rem); }";
  const processed = postcss(postcssRelativeRem()).process(input).css;

  expect(processed).toEqual(
    ":root { --example-2rem: calc(1 * var(--rem-relative-base)); } .rule { font-size: var(--example-2rem, calc(3 * var(--rem-relative-base))); }",
  );
});

test("rems inside of calcs", () => {
  const input = "h1 { font-size: calc(1.375rem + 1.5vw); }";
  const processed = postcss(postcssRelativeRem()).process(input).css;

  expect(processed).toEqual(
    "h1 { font-size: calc(calc(1.375 * var(--rem-relative-base)) + 1.5vw); }",
  );
});

test("customizable variable name", () => {
  const input = ".rule { font-size: 2rem }";
  const processed = postcss(
    postcssRelativeRem({
      baseCssVariable: "--custom-relative-var",
    }),
  ).process(input).css;

  expect(processed).toEqual(
    ".rule { font-size: calc(2 * var(--custom-relative-var)) }",
  );
});

test("does not replace rem when space is present", () => {
  const input = ".rule { font-size: 2 rem; }";
  const processed = postcss(postcssRelativeRem()).process(input).css;

  expect(processed).toEqual(input);
});

test("does not replace rem inside double quoted string", () => {
  const input = '.rule { font-family: "2rem"; }';
  const processed = postcss(postcssRelativeRem()).process(input).css;

  expect(processed).toEqual(input);
});

test("does not replace rem inside single quoted string", () => {
  const input = ".rule { font-family: '2rem'; }";
  const processed = postcss(postcssRelativeRem()).process(input).css;

  expect(processed).toEqual(input);
});

test("does not replace rem inside url", () => {
  const input = ".rule { background: url(2rem); }";
  const processed = postcss(postcssRelativeRem()).process(input).css;

  expect(processed).toEqual(input);
});

test("does not replace rem inside variable name being used", () => {
  const input = ".rule { font-size: var(--example-2rem); }";
  const processed = postcss(postcssRelativeRem()).process(input).css;

  expect(processed).toEqual(input);
});

test("does not replace rem inside variable name being defined", () => {
  const input = ":root { --example-2rem: pink; }";
  const processed = postcss(postcssRelativeRem()).process(input).css;

  expect(processed).toEqual(input);
});

// Not possible to support: https://stackoverflow.com/q/40722882
test("does not replace rem in media queries", () => {
  const input = "@media screen and (min-width: 2rem) { font-size: 18px }";
  const processed = postcss(postcssRelativeRem()).process(input).css;

  expect(processed).toEqual(input);
});
