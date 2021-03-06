import { _catch, _finally, _promise as promise, _then as then, _throw } from "lfjs-runtime/-internal";
import { addWatch as add_watch, atom, compareAndSet as compare_and_set_BANG_, deref, getValidator as get_validator, isAtom as atom_QMARK_, removeWatch as remove_watch, reset as reset_BANG_, setValidator as set_validator_BANG_, swap as swap_BANG_ } from "lfjs-runtime/atom";
import { clone, compact, conj, cons, count, empty, has as contains_QMARK_, isColl as coll_QMARK_, isEmpty as empty_QMARK_, notEmpty as not_empty, range, seq, sortBy as sort_by } from "lfjs-runtime/coll";
import { comp, complement, completing, constantly, curry, identity, juxt, memoize, partial } from "lfjs-runtime/fn";
import { assoc, assocIn as assoc_in, dissoc, find, get, getIn as get_in, hashMap as hash_map, keys, merge, mergeWith as merge_with, update, updateIn as update_in, vals, zip, zipmap } from "lfjs-runtime/hash-map";
import { apply, assert, isBlank as blank_QMARK_, isDate as date_QMARK_, isEqual as _EQ_, isFalse as false_QMARK_, isFn as fn_QMARK_, isHashMap as hash_map_QMARK_, isNil as nil_QMARK_, isNumber as number_QMARK_, isPresent as present_QMARK_, isSet as set_QMARK_, isString as string_QMARK_, isTrue as true_QMARK_, isVector as vector_QMARK_, key, println, typeOf as type_of, val } from "lfjs-runtime/lang";
import { add as _PLUS_, dec, divide as _SLASH_, floor, gt as _GT_, gte as _GT__EQ_, inc, isEven as even_QMARK_, isFloat as float_QMARK_, isInteger as integer_QMARK_, isNeg as neg_QMARK_, isOdd as odd_QMARK_, isPos as pos_QMARK_, isZero as zero_QMARK_, lt as _LT_, lte as _LT__EQ_, mod, multiply as _STAR_, subtract as _ } from "lfjs-runtime/math";
import { disj, join, set } from "lfjs-runtime/set";
import { camelCase as camel_case, capitalize, escape, kebabCase as kebab_case, lowerCase as lower_case, pad, padl, padr, snakeCase as snake_case, str, toLower as to_lower, toUpper as to_upper, trim, triml, trimr, unescape, upperCase as upper_case } from "lfjs-runtime/string";
import { cat, dedupe, drop, dropWhile as drop_while, filter, interpose, into, keep, map, mapcat, partition, partitionAll as partition_all, partitionBy as partition_by, reduce, remove, take, takeNth as take_nth, takeWhile as take_while, transduce } from "lfjs-runtime/transducers";
import { first, head, last, nth, pop, rest, reverse, subvec, tail, vec, vector } from "lfjs-runtime/vector";
const x = null;
const y = null;
const z = null;
const i = null;

_throw(x);

promise(x);
then(x, y);

_catch(x, y);

_finally(x, y);

atom(x);
atom_QMARK_(x);
deref(x);
reset_BANG_(x, y);
swap_BANG_(x, y);
compare_and_set_BANG_(x, y, z);
add_watch(x, y, z);
remove_watch(x, y);
set_validator_BANG_(x, y);
get_validator(x);
clone(x);
contains_QMARK_(x, y);
range(x, y, z);
count(x);
sort_by();
empty_QMARK_(x);
coll_QMARK_(x);
seq(x);
empty(x);
not_empty(x);
conj(x);
cons(x, y);
compact(x);
comp();
constantly(x);
curry(x, y, z);
identity(x);
memoize(x, y);
complement(x);
juxt();
partial();
completing(x);
keys(x);
vals(x);
zip();
hash_map();
merge(x);
merge_with();
zipmap(x, y);
get(x, y);
get_in(x, y);
assoc(x);
dissoc(x);
update(x, y, z);
assoc_in(x, y, z);
update_in(x, y, z);
find(x, y);
vector_QMARK_(x);
date_QMARK_(x);

_EQ_(x, y);

fn_QMARK_(x);
set_QMARK_(x);
string_QMARK_(x);
number_QMARK_(x);
nil_QMARK_(x);
hash_map_QMARK_(x);
blank_QMARK_(x);
present_QMARK_(x);
val(x);
key(x);
assert(x, y);
true_QMARK_(x);
false_QMARK_(x);
type_of(x);
println();
apply(x);
integer_QMARK_(x);

_GT_(x, y);

_LT_(x, y);

_GT__EQ_(x, y);

_LT__EQ_(x, y);

_PLUS_(x, y);

_(x, y);

_STAR_(x, y);

_SLASH_(x, y);

pos_QMARK_(x);
neg_QMARK_(x);
zero_QMARK_(x);
even_QMARK_(x);
odd_QMARK_(x);
dec(x);
inc(x);
mod(x, y);
float_QMARK_(x);
floor();
disj(x);
join(x);
set(x);
camel_case(x);
capitalize(x);
escape(x);
kebab_case(x);
lower_case(x);
pad(x, y, z);
padr(x, y, z);
padl(x, y, z);
snake_case(x);
to_lower(x);
to_upper(x);
trim(x, y, z);
trimr(x, y, z);
triml(x, y, z);
unescape(x);
upper_case(x);
str();
cat(x);
dedupe(x);
drop(x, y);
drop_while(x, y);
filter(x, y);
interpose(x, y);
into(x, y, z);
keep(x);
map(x, y);
mapcat(x, y);
partition(x, y, z);
partition_all(x, y, z);
partition_by(x, y);
reduce(x, y, z);
remove(x, y);
take(x, y);
take_nth(x, y);
take_while(x, y);
transduce(x, y, z, i);
head(x);
first(x);
tail(x);
rest(x);
vector();
subvec(x, y, z);
pop(x);
last(x);
nth(x, y);
reverse(x);
vec(x);