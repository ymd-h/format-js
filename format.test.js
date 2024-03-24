import { expect, test } from "bun:test";

import { format, format_date } from "./format.js";


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
])("format(%p) -> '%s'", (args, expected) => expect(format(...args)).toBe(expected));


test.each([
    [["%Y", new Date(2024, 3, 23)], "2024"],
    [["%m", new Date(2024, 3, 23)], "04"],
    [["%d", new Date(2024, 3, 23)], "23"],
    [["%H", new Date(2024, 3, 23)], "00"],
])("format_date(%p) -> '%s'",
   (args, expected) => expect(format_date(...args)).toBe(expected));
