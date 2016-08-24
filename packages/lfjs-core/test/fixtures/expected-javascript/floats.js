import { partitionBy as partition_by } from "lfjs-runtime/transducers";
import { floor } from "lfjs-runtime/math";
partition_by(floor, [6.1, 4.2, 6.3]);