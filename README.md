# postcss-relative-rem

A [PostCSS](https://github.com/postcss/postcss) plugin to convert `rem` units to units relative a CSS variable (instead of the root element's font size).

This will convert something like this:

```css
h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}
```

To:

```css
h1 {
  font-size: calc(2 * var(--rem-relative-base));
  margin-bottom: calc(0.5 * var(--rem-relative-base));
}
```

## Why?

The driver for this was to be able to use `rem` units inside [shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM) stylesheets. The shadow DOM mostly isolates a component's styles, but `rem` units still reference the `<html>` root's font-size, making `rem` unit sizes unpredictable if your component is injected into pages that may have variable `<html>` root font sizes defined that are outside of your control.

By changing the CSS so all `rem` units are relative to another CSS variable, this allows for better control over how to define your own root font-size. You can still use `rem` units in your variable definition, allowing for better accessibility than perhaps other alternatives (like converting everything to pixels).

## Installation

```sh
npm install --save-dev postcss postcss-relative-rem
```

## Usage

Add this plugin to your `postcss.config.js`:

```js
module.exports = {
  plugins: [require("postcss-relative-rem")],
};
```

The `--rem-relative-base` CSS variable must then also be defined in some way:

```html
<style>
  :root {
    --rem-relative-base: 1.6rem;
  }
</style>
```

### Shadow DOM Example

For a more concrete example of how this plugin can be used to dynamically deal with a shadow DOM component being injected into an unknown page (with variable root font size definitions), here's how you could set the `--rem-relative-base` CSS variable based on the component's inherited font size (instead of the root `<html>` font size):

```js
// Grab the container and setup the shadow DOM.
const containerEl = document.querySelector(".my-shadow-dom-container");
containerEl.attachShadow({ mode: "open" });

// Note: If the container will set its own font size or reset things, make sure
// this style is in place before the following font size calculations (if this
// is applied later by a stylesheet that hasn't yet loaded, then this may cause
// the calculations to be incorrect).
containerEl.style.setProperty("all", "initial");

// Determine the root `<html>` font size.
const rootFontSize = parseFloat(
  window
    .getComputedStyle(document.documentElement)
    .getPropertyValue("font-size"),
);

// Determine the font size of the shadow DOM container.
const containerFontSize = parseFloat(
  window.getComputedStyle(containerEl).getPropertyValue("font-size"),
);

// Calculate the relative base font size (to be used by the calculations done
// by this plugin) based on comparing the root font size to the contianer's
// font size.
const remRelativeBaseSize = `${containerFontSize / rootFontSize}rem`;

// Set the CSS variable on the container which will then be used by the calcs()
// this plugin provides.
containerEl.style.setProperty("--rem-relative-base", remRelativeBaseSize);
```

## Options

### `baseCssVariable`

Default: `--rem-relative-base`

Allows you to set a different CSS variable name to use.

```js
module.exports = {
  plugins: [
    require("postcss-relative-rem", {
      baseCssVariable: "--my-app-rem-base`,
    }),
  ],
};
```

## References

- https://discourse.wicg.io/t/hem-rem-for-web-component/2098
- https://github.com/cuth/postcss-pxtorem
- https://css-tricks.com/encapsulating-style-and-structure-with-shadow-dom/#aa-what-is-the-shadow-dom
- https://stackoverflow.com/questions/66147461/change-shadow-dom-rem-size
- https://stackoverflow.com/questions/24953647/font-size-css-values-based-on-shadow-dom-root
