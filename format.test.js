import { expect, test } from "bun:test";

import {
    format,
    format_date,
    patch_default_format,
    FStringLikeFormatter,
} from "./format.js";


test.each([
    [["{0}", 2], "2"],
    [["{0} {1}", 1.5, -2], "1.5 -2"],
    [["{0}", ], "undefined"],
    [["{0}", {}], "[object Object]"],
    [["{1} {0}", "a", "b"], "b a"],
    [["{0:4d}", 2], "   2"],
    [["{0:f}", 1.5], "1.500000"],
    [["{0:.2f}", 1.5], "1.50"],
    [["{0:x}", 15], "f"],
    [["{0:X}", 15], "F"],
    [["{0:o}", 8], "10"],
    [["{0:b}", 3], "11"],
    [["{0:<4d}", 1], "1   "],
    [["{0:^4d}", 1], " 1  "],
    [["{0:>4d}", 1], "   1"],
    [["{0:.0%}", 0.23], "23%"],
    [["{0:f}", 1/0], "infinity"],
    [["{0:f}", 0/0], "nan"],
    [["{0:F}", 1/0], "INFINITY"],
    [["{0:F}", 0/0], "NAN"],
])("format(%p) -> '%s'", (args, expected) => expect(format(...args)).toBe(expected));

test.each([
    [[{"w": (v, p) => v.toFixed(p) + ` (${p})`}], ["{0:.2w}", 1.5], "1.50 (2)"],
    [[{}, {"*": (v, w) => v.padStart(w, "*")}], ["{0:*3d}", 2], "**2"],
])("format patch: %p, format(%p) -> %s", (patch, args, expected) => {
    const f = patch_default_format(...patch);
    expect(f.format(...args)).toBe(expected);
});


test.each([
    [[{"t": (v, p) => {
        const vv = v.toString();
        return (vv.length >= p) ? vv.slice(0, p) : vv;
    } }, {"": (v, w) => v }], ["{0:.2t}", 1000], "10"],
])("custom format: %p, format(%p) -> %s", (config, args, expected) => {
    const f = new FStringLikeFormatter(...config);
    expect(f.format(...args)).toBe(expected);
});


test.each([
    [["%Y", new Date(2024, 3, 23)], "2024"],
    [["%y", new Date(2024, 3, 23)], "24"],
    [["%m", new Date(2024, 3, 23)], "04"],
    [["%d", new Date(2024, 3, 23)], "23"],
    [["%%d", new Date(2024, 3, 23)], "%d"],
    [["%%%d", new Date(2024, 3, 23)], "%23"],
    [["%Y%m%d", new Date(2024, 3, 23)], "20240423"],
    [["%Y/%m/%d", new Date(2024, 3, 23)], "2024/04/23"],
    [["%H", new Date(2024, 3, 23, 13, 5, 2, 33)], "13"],
    [["%I", new Date(2024, 3, 23, 13, 5, 2, 33)], "01"],
    [["%M", new Date(2024, 3, 23, 13, 5, 2, 33)], "05"],
    [["%S", new Date(2024, 3, 23, 13, 5, 2, 33)], "02"],
    [["%f", new Date(2024, 3, 23, 13, 5, 2, 33)], "033"],
    [["%p", new Date(2024, 3, 23, 13, 5, 2, 33)], "PM"],
    [["%T", new Date(2024, 3, 23, 13, 5, 2, 33)], "13:05:02"],
])("format_date(%p) -> '%s'",
   (args, expected) => expect(format_date(...args)).toBe(expected));
