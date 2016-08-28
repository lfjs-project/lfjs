import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';

const { PACKAGE_NAME, NODE_ENV } = process.env;

const config = {
  format: 'amd'
};

const defaultPlugins = [
  nodeResolve({
    jsnext: true,
    main: true,
    skip: ['chai']
  }),
  commonjs(),
  babel(babelrc())
];

function build(moduleId) {
  let dest = 'dist/browser/index.js',
      entry = 'src/index.js',
      plugins = [].concat(defaultPlugins);

  switch (NODE_ENV) {
  case 'test':
    entry = `test/${moduleId.replace('lfjs-', '')}.test.js`;
    dest = 'dist/test.js';
    moduleId = `${moduleId}/test`;
    break;
  case 'production':
    plugins.push(uglify);
  }

  return Object.assign({
    dest,
    entry,
    moduleId,
    plugins
  }, config);
}

export default build(PACKAGE_NAME);
