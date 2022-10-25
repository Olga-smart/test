extends ../../../layouts/base
поддерживает только 1 уровень extends

# AutoImportPlugin
AutoImportPlugin is a Webpack plugin that automatically imports `js` and `scss` files of components used on the `pug` page.

## Table of Contents
1. [Dependencies](#dependencies)
2. [How to Use](#how-to-use)
3. [Restrictions](#restrictions)
4. [Settings](#settings)

## Dependencies
[cross-env 7.0.3+](https://www.npmjs.com/package/cross-env)

❗On the final build NODE_ENV environment variable must be set to `production`. That is, in `package.json` there will be such a script:
```json
"scripts": {
  "build": "cross-env NODE_ENV=production webpack --mode production",
}
```

## How to Use
1. Add file `AutoImportPlugin.js` to the project folder:
2. Add `import './autoimport';` to all `js` files of all `pug` pages for which you want to set up auto import.

    > 📌 If the `pug` page does not have a `js` file, it needs to be created.
3. Make sure the filenames, folder structure and include syntax comply with the [restrictions](#restrictions).
4. 

## Restrictions

### Pages

1. Incudes in `pug` should be without extensions.

    > ✅ Do this
    > ```pug
    > include ../../../components/header/header
    > ```

    > ❌ Don't do this
    > ```pug
    > include ../../../components/header/header.pug
    > ```

2. The `pug` page must have the same name as the folder.

    > ✅ Do this
    > ```
    > 📦landing-page
    >   ┣ 📜landing-page.js
    >   ┗ 📜landing-page.pug   <--- this file will be processed by the plugin
    > ```

    > ❌ Don't do this
    > ```
    > 📦landing-page
    >   ┣ 📜landing-page.js
    >   ┗ 📜index.pug          <--- plugin will not see this file
    > ```

3. The pages folder that we pass to the plugin should have the following structure: `[pages folder] > [page folder] > [pug ang js files of the page]`.

    > ✅ Do this
    > ```
    > 📦site
    >   ┣ 📂landing-page
    >   ┃   ┣ 📜landing-page.js
    >   ┃   ┗ 📜landing-page.pug
    >   ┣ 📂registration
    >   ┃   ┣ 📜registration.js
    >   ┃   ┗ 📜registration.pug
    >   ┗ 📂sign-in
    >       ┣ 📜sign-in.js
    >       ┗ 📜sign-in.pug
    > ```

    > ❌ Don't do this
    > ```
    > 📦site
    >   ┣ 📜landing-page.js
    >   ┣ 📜landing-page.pug
    >   ┣ 📜registration.js
    >   ┣ 📜registration.pug
    >   ┣ 📜sign-in.js
    >   ┗ 📜sign-in.pug
    > ```

    > ❌ Don't do this
    > ```
    > 📦site
    >   ┗ 📂pages
    >       ┣ 📂landing-page
    >       ┃   ┣ 📜landing-page.js
    >       ┃   ┗ 📜landing-page.pug
    >       ┣ 📂registration
    >       ┃   ┣ 📜registration.js
    >       ┃   ┗ 📜registration.pug
    >       ┗ 📂sign-in
    >           ┣ 📜sign-in.js
    >           ┗ 📜sign-in.pug
    > ```

### Components    

1.  The `js` component files should be named like this - `init.js`.

    > ✅ Do this
    > ```
    > 📦header
    >   ┣ 📜Header.js
    >   ┣ 📜header.pug
    >   ┣ 📜header.scss
    >   ┗ 📜init.js       <--- this file will be imported by the plugin
    > ```

    > ❌ Don't do this
    > ```
    > 📦header
    >   ┣ 📜header.pug
    >   ┣ 📜header.scss
    >   ┗ 📜header.js     <--- plugin will not see this file
    > ```

2. The `scss` component file must have the same name as the folder.

    > ✅ Do this
    > ```
    > 📦header
    >   ┣ 📜header.pug
    >   ┗ 📜header.scss   <--- this file will be imported by the plugin
    > ```

    > ❌ Don't do this
    > ```
    > 📦header
    >   ┣ 📜header.pug
    >   ┗ 📜style.scss    <--- plugin will not see this file
    > ```

## Settings
| Option           | Data-Attr              | Defaults | Type    | Description          |
| ---              | ---                    | ---      | ---     | ---                  |
| `min`            | `data-min`             | `0`      | number  | Slider minimum value |
| `max`            | `data-max`             | `100`    | number  | Slider maximum value |
| `range`          | `data-range`           | `true`   | boolean | False for one handle, true for two handles |
| `leftValue`      | `data-left-value`      | `25`     | number  | Start position for left/bottom handle (or for single handle) |
| `rightValue`     | `data-right-value`     | `75`     | number  | Start position for right/top handle |
| `step`           | `data-step`            | `1`      | number  | Slider`s step. Always > 0. Could be fractional |
| `minMaxLabels`   | `data-min-max-labels`  | `true`   | boolean | Shows min and max labels |
| `valueLabels`    | `data-value-labels`    | `true`   | boolean | Shows from and to labels |
| `vertical`       | `data-vertical`        | `false`   | boolean | Makes slider vertical |
| `scale`          | `data-scale`           | `false`  | boolean | Shows scale |
| `scaleIntervals` | `data-scale-intervals` | `5`      | number  | Number of scale intervals |
| `panel`          | `data-panel`           | `false`  | boolean | Enables panel for interactive slider settings |

## Public Methods

To use public methods, at first you must save slider instance to variable:

```javascript
// Launch plugin
$('.js-range-slider').rangeSlider();

// Saving it's instance to variable
const slider = $('.js-range-slider').data('rangeSlider');

// Fire public method
slider.setLeftValue(50);

// Method calls can be chained
slider.setLeftValue(50).setRightValue(80).setStep(10);
```

There are 3 public methods, whose names speak for themselves:
``` javascript
// setLeftValue
slider.setLeftValue(50);

// setRightValue
slider.setRightValue(80);

// setStep
slider.setStep(10);
```

## Events

You may add your own handler for slider values change event:
``` javascript
// Launch plugin
$('.js-range-slider').rangeSlider();

// Saving it's instance to variable
const slider = $('.js-range-slider').data('rangeSlider');

// Write your event handler
slider.onChange = (leftValue, rightValue) => {
  // your code to be executed when the slider values ​​change
};
```

Also you may use only 1 parameter:
``` javascript
slider.onChange = (leftValue) => {
  // your code to be executed when the slider values ​​change
};
``` 

Or even without parameters:
``` javascript
slider.onChange = () => {
  // your code to be executed when the slider values ​​change
};
```

You may easily remove this handler later:
``` javascript
delete slider.onChange;
```


 