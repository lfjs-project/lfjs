import { map } from "lfjs-runtime/transducers";
import { inc } from "lfjs-runtime/math";

const a = x => map(inc, x);