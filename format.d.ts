/**
 * format-js provides two types of formatter;
 *
 * 1. Python f-string like formatter ({@linkcode FStringLikeFormatter})
 * 2. date command like formatter ({@linkcode DateLikeFormatter})
 *
 * Both formatter have default predefined formatter instances
 * which can be called through free functions
 * {@linkcode format} and {@linkcode format_date} respectively.
 *
 * You can also cutomize formatters by patching existing (including default) ones,
 * or creating from scratch.
 *
 * @example Use predefined formatters
 * ```js
 * format("{0} + {1} = {2}", 1, 2, 1+2); // "1 + 2 = 3"
 * format_date("%Y%m%d", new Date("2024-06-29")); // "20240629"
 * ```
 *
 * @example Patch default FStringLikeFormatter
 * ```js
 * const fmt = patch_default_format(
 *     { "w": (value, precision) => `${value.toFixed(precision)} + (${precision})` },
 *     {},
 * );
 * fmt.format("0:.2w", 1); // "1.00 (2)"
 * ```
 *
 * @module format
 */


/**
 * Handler definitions for {@linkcode FStringLikeFormatter}
 *
 * `.format()` method dispatches based on this handler definitions.
 * Handler function takes argument value and required precision,
 * and returns partially formatted string without width-adjustment.
 */
export type FStringHandler = Record<string, (v: any, precision: number) => string>;

/**
 * Alignment definitions for {@linkcode FStringLikeFormatter}
 *
 * `.format()` method dispatches based on this alignment definitions.
 * Alignment function takes partially formatted string and required width,
 * and returns width-adjusted string.
 */
export type FStringAlign = Record<string, (v: string, width: number) => string>;

/**
 * Options for {@linkcode FStringLikeFormatter}
 */
export interface FStringOptions {
    /**
     * Default precision for floating point number.
     * If this value is not specified, 6 is used.
     */
    defaultPrecision?: number;
}

/**
 * Python f-string like formatter
 *
 * Integers enclosed by curly braces (e.g. `{0}`) are replaced with corresponding arguments.
 * Optionally, 'alignment', 'width', 'precision', and/or 'type' can be specified.
 * Pseudo syntax is `{index[:[[align]width][.precision]type]}`.
 */
export declare class FStringLikeFormatter {
    /**
     * Create a new f-string like formatter with given handlers, align, and options.
     *
     * @constructor
     * @param {FStringHandler} handlers Handler definitions
     * @param {FStringAlign} align Alignment definitions
     * @param {FStringOptions?} options Options
     */
    constructor(handers: FStringHandler, align: FStringAlign, options: FStringOptions);

    /**
     * Format string with Python f-string like syntax
     *
     * @param {string} msg Message template
     * @param {...any} args Arguments to be assigned to template
     * @returns {string} Formatted string
     */
    format(msg: string, ...args: any): string;

    /**
     * Create a new `FStringLikeFormatter` with patch
     *
     * This method doesn't modify this object itself, and creates new one with patch.
     *
     * @param {FStringHandler?} handler Handler definitions
     * @param {FStringAlign?} align Alignment definitions
     * @returns {FStringLikeFormatter} Patched `FStringLikeFormatter`
     */
    patch(handlers?: FStringHandler, align?: FStringAlign): FStringLikeFormatter;
}

declare var DefaultFStringFormatter: FStringLikeFormatter;


/**
 * Handler definitions for {@linkcode DateLikeFormatter}
 *
 * `.format()` method dispatches based on this handler definitions.
 * Handler function takes an argument value,
 * and returns formatted string.
 */
export type DateHanler<T> = Record<string, (v: T) => string>;


/**
 * Options for {@linkcode DateLikeFormatter}
 */
export interface DateOptions {
    /**
     * Key letter to specify replacement.
     * If this value is not specified, `'%'` is used.
     * The letter must be a single letter.
     */
    mark?: string;
}

/**
 * date command like formatter
 *
 * Special letter (`'%'` by default) followed by key letters
 * will be replaced by corresponding formatted string.
 *
 * This class is designed for formatting `Date` object,
 * however, can work with other object as long as setting appropriate handlers,
 * and can be useful when formatting multiple properties of a single object.
 *
 * @template T
 */
export declare class DateLikeFormatter<T> {
    /**
     * Create a new date command like formatter with given handlers and options.
     *
     * @constructor
     * @param {DateHanler<T>} handlers Handler definitions
     * @param {DateOptions?} options Options
     */
    constructor(handlers: DateHanler<T>, options?: DateOptions);

    /**
     * Format string with date command like syntax
     *
     * @param {string} msg Message template
     * @param {T} v Value
     * @returns {string} Formatted String
     */
    format(msg: string, v: T): string;

    /**
     * Create a new patched `DateLikeFormatter<T>`
     *
     * This method doesn't modify this object itself, and creates new one with patch.
     *
     * @param {DateHanler<T>} handlers Handler definitions
     * @returns {DateLikeFormatter<T>} Patched `DateLikeFormatter<T>`
     */
    patch(handlers: DateHanler<T>): DateLikeFormatter<T>;
}

declare var DefaultDateFormatter: DateLikeFormatter<Date>;

/**
 * Format string with Python f-string like syntax
 *
 * This free function calls a predefined default {@linkcode FStringLikeFormatter} instance's
 * `.format()` method.
 *
 * @param {string} msg Message template
 * @param {...any} args Arguments to be assigned to template
 * @returns {string} Formatted string
 */
export declare function format(msg: string, ...args: any): string;

/**
 * Format string with date command like syntax
 *
 * This free function calls a predefined default {@linkcode DateLikeFormatter} instance's
 * `.format()` method.
 *
 * @param {string} msg Message template
 * @param {Date} date Date to be formatted.
 * @returns {string} Formatted string
 */
export declare function format_date(msg: string, date: Date): string;

/**
 * Patch default {@linkcode FStringLikeFormatter} instance
 *
 * This free function calls a predefined default `FStringLikeFormatter` instance's
 * `.patch()` method.
 *
 * @param {FStringHandler?} handler Handler definitions
 * @param {FStringAlign?} align Alignment definitions
 * @returns {FStringLikeFormatter} Patched `FStringLikeFormatter`
 */
export declare function patch_default_format(
    handlers?: FStringHandler,
    align?: FStringAlign
): FStringLikeFormatter;

/**
 * Patch default {@linkcode DateLikeFormatter}
 *
 * This free function calls a predefined default `DateLikeFormatter<Date>` instance's
 * `.patch()` method.
 *
 * @param {DateHanler<Date>} handlers Handler definitions
 * @returns {DateLikeFormatter<Date>} Patched `DateLikeFormatter<Date>`
 */
export declare function patch_default_format_date(
    handlers: DateHanler<Date>
): DateLikeFormatter<Date>;
