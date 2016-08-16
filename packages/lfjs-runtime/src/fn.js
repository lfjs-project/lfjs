export const juxt = (...fns) => (v) => fns.map(fn => fn(v));
