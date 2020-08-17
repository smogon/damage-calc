'use strict';

const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');
const terser = require('terser');

const config = {
  compact: false,
  plugins: [
    ['@babel/plugin-transform-typescript', {'isTSX': true}],
    ['@babel/plugin-proposal-class-properties', {'loose': true}],
    ['@babel/plugin-proposal-optional-chaining', {'loose': true}],
    ['@babel/plugin-proposal-object-rest-spread', {'loose': true, 'useBuiltIns': true}],
    '@babel/plugin-proposal-optional-catch-binding',
    '@babel/plugin-transform-arrow-functions',
    ['@babel/plugin-transform-block-scoping', {'throwIfClosureRequired': true}],
    ['@babel/plugin-transform-classes', {'loose': true}],
    ['@babel/plugin-transform-computed-properties', {'loose': true}],
    ['@babel/plugin-transform-destructuring', {'loose': true, 'useBuiltIns': true}],
    ['@babel/plugin-transform-for-of', {'assumeArray': true}],
    '@babel/plugin-transform-literals',
    '@babel/plugin-transform-parameters',
    '@babel/plugin-transform-shorthand-properties',
    ['@babel/plugin-transform-spread', {'loose': true}],
    ['@babel/plugin-transform-template-literals', {'loose': true}],
    '@babel/plugin-transform-member-expression-literals',
    '@babel/plugin-transform-property-literals'
  ],
}

class Bundler {
  constructor(dirname) {
    this.built = path.resolve(dirname, 'dist');
  }

  read(f, b = 0, e = 0) {
    try {
      const data = fs.readFileSync(path.join(this.built, f), 'utf8');
      if (e) return data.split('\n').slice(b, -e).join('\n') + '\n';
      if (b) return data.split('\n').slice(b).join('\n') + '\n';
      return data + '\n';
    } catch (err) {
      if (err.code === 'ENOENT') {
        console.error(`Missing file 'dist/${f}' - did you run \`npm run compile\`?`);
        process.exit(1);
      }
      throw err;
    }
  }

  async bundle(bundled, output = 'production.min.js') {
    bundled = babel.transformSync(bundled, config).code;
    bundled = (await terser.minify(bundled)).code;
    fs.writeFileSync(path.join(this.built, output), bundled);
  }
}

module.exports = Bundler;
