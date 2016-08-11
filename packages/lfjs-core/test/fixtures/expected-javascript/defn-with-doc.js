import { map } from "lodash/fp";
import { inc } from "lfjs/core";

const a = x => map(inc, x);