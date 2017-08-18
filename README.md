# Rollup Plugin Absolute Module Fix
Regarding [this issue](https://github.com/angular/angular/issues/17171) I wrote this rollup plugin to fix it temporarily. Looking forward to see when Angular team will fix this.  
Only will replace absolute module path from `module/index` to `module` and ignore relative paths.

## Installation
You can install from npm repository
```sh
$ npm install --save-dev rollup-plugin-absolute-module-fix
```

## Usage

```js
import { rollup } from 'rollup';
import absModuleFix from 'rollup-plugin-absolute-module-fix';

rollup({
  entry: 'main.js',
  plugins: [
    absModuleFix()
  ]
}).then(...)
```

## License

MIT
