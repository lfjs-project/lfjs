import { map } from "lodash/fp";
import { inc } from "lfjs-runtime";

const a = x => map(inc, x);
