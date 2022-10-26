# AutoImportPlugin
AutoImportPlugin is a Webpack plugin that automatically imports `js` and `scss` files of components used on the `pug` page.

> 📌 It is assumed that you included the necessary components yourself in the `pug` file.

> 📌 The plugin was created for 1 specific project, so it does not have a flexible configuration. Please read some [source file restrictions](#restrictions) before using it.

## Table of Contents
1. [Dependencies](#dependencies)
2. [How to Use](#how-to-use)
3. [Initialization](#initialization)
4. [Restrictions](#restrictions)

## Dependencies
[cross-env 7.0.3+](https://www.npmjs.com/package/cross-env)

❗On the final build `NODE_ENV` environment variable must be set to `production`. That is, in `package.json` there will be such a script:
```json
"scripts": {
  "build": "cross-env NODE_ENV=production webpack --mode production",
}
```

## How to Use
1. Add the file `AutoImportPlugin.js` to the project folder.
2. Add `import './autoimport';` to all `js` files of all `pug` pages for which you want to set up auto import.

    > 📌 If the `pug` page does not have a `js` file, it needs to be created.
3. Make sure the filenames, folder structure and include syntax comply with the [restrictions](#restrictions).
4. Make sure the build script (`package.json` file) is written to set the `NODE_ENV` environment variable to `production` (see [dependencies](#dependencies)).
5. [Initialize](#initialization) the plugin in the webpack config file.

 > 📌 On abnormal shutdown (for example, if you exit development mode by simply closing the console), auto-generated `autoimport.js` files will remain in the source files. It won't break anything. You can remove them manually, or they will be removed automatically the next time you run the build.

## Initialization
```js
// webpack.config.js
const AutoImportPlugin = require('./path/to/AutoImportPlugin');

module.exports = {
  plugins: [
    new AutoImportPlugin({
      pages: path.resolve(__dirname + '/path/to/folder/with/site/pages'),
      components: path.resolve(__dirname + '/path/to/folder/with/components')
    }),
  ]
}
```

> 📌 `__dirname` is an environment variable that tells you the absolute path of the directory containing the currently executing file (webpack config file in our case). To use it you need to include the `Node` module `path`, which provides utilities for working with file and directory paths:
> ```js
> // webpack.config.js
> const path = require('path');
> ```

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
    >   ┗ 📜index.pug          <--- the plugin will not see this file
    > ```

3. The pages folder that we pass to the plugin should have the following structure: `[pages folder] > [page folder] > [pug and js files of the page]`.

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

4. The plugin supports only 1 level of `pug` templates. This means that the components of the template used in the `pug` page will be automatically imported. But if this template extends another template, then the components of that parent template will not be imported.

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
    >   ┗ 📜header.js     <--- the plugin will not see this file
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
    >   ┗ 📜style.scss    <--- the plugin will not see this file
    > ```

3. The components folder that we pass to the plugin should have the following structure: `[components folder] > [component folder] > [pug, scss and js files of the component]`.

    > ✅ Do this
    > ```
    > 📦components
    >   ┣ 📂button
    >   ┃   ┣ 📜button.pug
    >   ┃   ┗ 📜button.scss
    >   ┣ 📂checklist
    >   ┃   ┣ 📜checklist.pug
    >   ┃   ┣ 📜checklist.scss
    >   ┃   ┗ 📜init.js
    >   ┣ 📂input
    >   ┃   ┣ 📜init.js
    >   ┃   ┣ 📜input.pug
    >   ┃   ┗ 📜input.scss
    >   ┗ 📂logo
    >       ┣ 📜logo.pug
    >       ┗ 📜logo.scss
    > ```

    > ❌ Don't do this
    > ```
    > 📦components
    >   ┣ 📜button.pug
    >   ┣ 📜button.scss
    >   ┣ 📜checklist.pug
    >   ┣ 📜checklist.scss
    >   ┣ 📜input.pug
    >   ┣ 📜input.scss
    >   ┣ 📜logo.pug
    >   ┗ 📜logo.scss
    > ```

    > ❌ Don't do this
    > ```
    > 📦components
    >   ┣ 📂button
    >   ┃   ┣ 📂scss
    >   ┃   ┃   ┗ 📜button.scss
    >   ┃   ┗ 📜button.pug
    >   ┣ 📂checklist
    >   ┃   ┣ 📂js
    >   ┃   ┃   ┗ 📜init.js
    >   ┃   ┣ 📂scss
    >   ┃   ┃   ┗ 📜checklist.scss
    >   ┃   ┗ 📜checklist.pug
    >   ┣ 📂input
    >   ┃   ┣ 📂js
    >   ┃   ┃   ┗ 📜init.js
    >   ┃   ┣ 📂scss
    >   ┃   ┃   ┗ 📜input.scss
    >   ┃   ┗ 📜input.pug
    >   ┗ 📂logo
    >       ┣ 📂scss
    >       ┃   ┗ 📜logo.scss
    >       ┗ 📜logo.pug
    > ```
