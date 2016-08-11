import * as registerCache from "./cache";
import { transformFileSync, VERSION } from "lfjs-core";
import fs from "fs";
//import path from "path";

registerCache.load();
let cache = registerCache.get();

//let cwd = process.cwd();

// function getRelativePath(filename){
//   return path.relative(cwd, filename);
// }

function mtime(filename) {
  return +fs.statSync(filename).mtime;
}

function compile(filename) {
  let result;

  let cacheKey = VERSION;

  let env = process.env.LFJS_ENV || process.env.NODE_ENV;
  if (env) { cacheKey += `:${env}`; }

  if (cache) {
    let cached = cache[cacheKey];
    if (cached && cached.mtime === mtime(filename)) {
      result = cached;
    }
  }

  if (!result) {
    result = transformFileSync(filename, { babel: true });
  }

  if (cache) {
    cache[cacheKey] = result;
    result.mtime = mtime(filename);
  }

  return result.code;
}

// function shouldIgnore(filename) {
//   return getRelativePath(filename).split(path.sep).indexOf("node_modules") >= 0;
// }

function loader(m, filename) {
  m._compile(compile(filename), filename);
}

function registerExtension(ext) {
  require.extensions[ext] = function(m, filename) {
    loader(m, filename);
  };
}

function hookExtensions(extensions) {
  extensions.forEach(registerExtension);
}

hookExtensions(['.lfjs', '.cljs']);

export default function(opts = {}) {
  if (opts.extensions) {
    hookExtensions(opts.extensions);
  }

  if (opts.cache === false) cache = null;

  delete opts.extensions;
  delete opts.cache;

  //extend(transformOpts, opts);
}
