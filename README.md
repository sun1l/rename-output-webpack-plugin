# Rename Output Webpack Plugin
Webpack plugin to custom rename each outfile files / chunks generated during build.

[![npm](https://img.shields.io/npm/v/rename-output-webpack-plugin.svg)](https://www.npmjs.com/package/rename-output-webpack-plugin)
[![GitHub issues](https://img.shields.io/github/issues/sun1l/rename-output-webpack-plugin.svg)](https://github.com/sun1l/rename-output-webpack-plugin/issues)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/sun1l/rename-output-webpack-plugin/master/LICENSE)

[Installation](#Installation) |
[Usage](#usage) |
[License](#license)

## Installation

```bash
npm install rename-output-webpack-plugin --save-dev
```

## Usage

```javascript
// webpack.config.js

const renameOutputPlugin = require('rename-output-webpack-plugin');

module.exports = {
    entry: {
        'core': './src/core.js',
        'app': './src/index.js',
        'jquery': ['jquery'],
        'angular-suite': ['angular', 'angular-ui-bootstrap', 'angular-ui-router'],
    },
    output: {
        'filename': '[name]-[id].js',
        'path': path.resolve(__dirname, 'dist')
    },
    plugins: [
        new renameOutputPlugin({
            'core': 'framework-[hash].js',
            'jquery': '[name]-[version].min.js',
            'angular-suite': '[name]-[version@angular].min.js'
        })
    ]
};
```
This configuration will generate following files:

```bash
Hash: 7aa4bcb22d7fa4791dd8
Version: webpack 3.8.1
Time: 1812ms
                            Asset     Size  Chunks                    Chunk Names
                         app-0.js  2.08 MB       0  [emitted]  [big]  app
       angular-suite-1.6.6.min.js  1.73 MB       1  [emitted]  [big]  angular-suite
              jquery-3.2.1.min.js   271 kB       2  [emitted]  [big]  jquery
framework-7aa4bcb22d7fa4791dd8.js   271 kB       3  [emitted]  [big]  core
```

## Using `[version]`

In Webpack configuration (webpack.config.js), [output.filename](https://webpack.js.org/configuration/output/#output-filename) supports following substitutions:
* [hash]
* [chunkhash]
* [name]
* [id]
* [query]

This plugin adds one more substitution `[version]`. _[version]_ allow you to use version of dependency within your output bundle filename. For e.g. If you are using jquery and chunking it separately, you can add _[version]_ to ensure right version (from jquery module package.json) is added within output filename.

```javascript
module.exports = {
    entry: {
        'jquery': ['jquery']
    },
...
    plugins: [
        new renameOutputPlugin({
            'jquery': '[name]-[version].min.js'
        })
    ]
};
```
```bash
              Asset     Size  Chunks                    Chunk Names
jquery-3.2.1.min.js   271 kB       2  [emitted]  [big]  jquery
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
