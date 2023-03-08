// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';
process.env.ASSET_PATH = '/';

const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const config = require('../webpack.config');
const ZipPlugin = require('zip-webpack-plugin');

delete config.chromeExtensionBoilerplate;

config.mode = 'production';

const packageInfo = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
const filename = `${packageInfo.name}-${packageInfo.version}.zip`;

console.log('ouuut', path.join(__dirname, '../', 'zip', filename));

config.plugins = (config.plugins || []).concat(
  new ZipPlugin({
    filename,
    path: path.join(__dirname, '../', 'zip'),
  })
);

webpack(config, function (err) {
  if (err) throw err;
  console.log('build done');
});
