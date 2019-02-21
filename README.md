[<img src="https://csstyle.io/assets/img/logo.png" alt="csstyle" width="256" style="max-width:100%;">](https://csstyle.io)

**Clean**, **simple**, for styling the **web**.

csstyle is a modern approach for crafting **beautifully maintainable** stylesheets. Keeping CSS clean and organized is really hard. csstyle provides a higher-level abstraction for writing modular CSS. Written for [Sass](https://sass-lang.com/), it makes your CSS readable and semantic, generates your selectors for you, and automatically handles things like specificity and nesting.

csstyle makes your project's styling **refreshingly consistent**

## Getting Started

Install csstyle via npm or yarn.

```shell
$ npm install --save-dev csstyle
$ yarn add --dev csstyle
```

Next, you need to add the `app` id to your `html` tag. You can use another id if you like, but you will need to configure this in your csstyle settings.

```html
<!DOCTYPE html>
<html id="app" lang="en">
...
</html>
```

Lastly, you'll need to import csstyle in your main sass file.

```scss
@import '~csstyle/csstyle';
```

Now you're set and can start creating components with options & parts, adding in tweaks and locations as needed. Enjoy!

## Documentation

Documentation for csstyle can be found [here](https://csstyle.io/installation).

## License

csstyle is open-sourced software licensed under the [MIT license](https://github.com/csstyle-org/csstyle/blob/master/LICENSE).
