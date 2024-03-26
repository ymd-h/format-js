# format.js


## 1. Usage
format.js provides two usage;

1. Python f-string like format
1. date command like format

Both usage have default formatter and user customization.


### 1.1 f-String like format
#### 1.1.1 Default Usage
```javascript
import { format } from "https://cdn.jsdelivr.net/gh/ymd-h/format-js/format.js";

format("{0} + {1} = {2}", 1, 2, 1+2); // "1 + 2 = 3"
format("Precision: {0:.2f}", 1.78); // "Precision: 1.78"
format("Width: {0:4d}", 1); // "   1"
format("Hex: {0:x}", 15); // "f"
format("Align: {0:<4d}", 1); // "1   "
```

#### 1.1.2 Patch on Default
```javascript
import { patch_default_format } from "https://cdn.jsdelivr.net/gh/ymd-h/format-js/format.js";

const f = patch_default_format(
    { // key: (value: *, precision: number) => formatted_string
        "w": (value, precision) => value.toFixed(precision) + ` (${precision})`,
    }, // Patch for Format Handlers (optional)
    { // key: (value: string, width: number) => aligned_string
        "*": (value, width) => value.padStart(width, "*"),
    }, // Patch for Align (optional)
);

f.format("{0:.2w}", 1); // "1.00 (2)"
f.format("{0:.6w}", 1.25); // "1.000000 (6)"
f.format("{0:*6.2f}", 1); // "**1.00"
```


#### 1.1.3 Custom Formatter from scratch
```javascript
import { FStringLikeFormatter } from "https://cdn.jsdelivr.net/gh/ymd-h/format-js/format.js";

const f = new FStringLikeFormatter(
    {
        ...
    }, // handlers
    {
        ...
    }, // align
    { defaultPrecision: 2 }, // options (optional)
);

f.format("My name is {0}.", "ymd-h");
```


### 1.2 date like format

#### 1.2.1 Default Usage
```javascript
import { format_date } from "https://cdn.jsdelivr.net/gh/ymd-h/format-js/format.js";

format_date("%Y-%m-%d %H:%M:%S", new Date(2024, 2, 24, 18, 44, 52)); // "2024-03-24 18:44:52"
format_date("%T", new Date(2024, 2, 24, 18, 44, 52)); // "18:44:52"
```


#### 1.2.2 Patch on Default
```javascript
import { patch_default_formatformat_date } from "https://cdn.jsdelivr.net/gh/ymd-h/format-js/format.js";

const f = patch_default_formatformat_date({
    "p": d => (d.getHours() < 12) ? "a.m." : "p.m.",
});

f.format("%p", new Date(2024, 2, 24, 18, 44, 52)); // "p.m."
```


#### 1.2.3 Custom Formatter from scratch
```javascript
import { DateLikeFormatter } from "https://cdn.jsdelivr.net/gh/ymd-h/format-js/format.js";

const f = new DateLikeFormatter({
    "p": d => (d.getHours() < 12) ? "a.m." : "p.m.",
});

f.format("%p", new Date(2024, 2, 24, 18, 44, 52)); // "p.m."
```



## 2. Predefined Handlers / Aligns for Default Formatters

### 2.1 f-String like format

| format | description |
|---|---|
|`s`| string (`.toString()`) |
|`b`| binary number |
|`c`| unicode character (`String.fromCodePoint()`) |
|`d`| integer |
|`o`| octal number |
|`x`| hexadecimal number. Use `a`-`f` for 10 to 15 |
|`X`| hexadecimal number. Use `A`-`F` for 10 to 15 |
|`e`| scientific notation. Use `e` for exponent |
|`E`| scientific notation. Use `E` for exponent |
|`f`| fixed point notation. Use `nan` / `infinity` |
|`F`| fixed point notation. Use `NAN` / `INFINITY` |
|`%`| percentage. multuply 100, fixed notation follewed by `%` |


| align | description |
|---|---|
|`<`| align left |
|`^`| align middle |
|`>` / (empty) | align right (default) |


### 2.2 date like format

| format | description |
|---|---|
|`%y`| year without century (2 digit) |
|`%Y`| year with century (4 digit) |
|`%m`| 2 digit month (`01` - `12`) |
|`%d`| 2 digit date (`01` - `31`) |
|`%H`| 24 hour 2 digit hour (`00` - `23`) |
|`%I`| 12 hour 2 digit hour (`01` - `12`) |
|`%p`| AM or PM |
|`%M`| 2 digit minute (`00` - `59`) |
|`%S`| 2 digit second (`00` - `59`) |
|`%f`| 3 digit microsecond (`000` - `999`) |
|`%s`| Unix Time. Elapsed seconds from 1970-01-01 00:00:00 UTC |
|`%T`| Same as `%H:%M:%S` |
|`%w`| day of the week as number. Sunday is `0`. (`0` - `6`) |
|`%%`| `%` (escaped) |
