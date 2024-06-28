type FStringHandler = Record<string, (v: any, precision: number) => string>;
type FStringAlign = Record<string, (v: string, width: number) => string>;

interface FStringOptions {
    defaultPrecision?: number;
}

declare class FStringLikeFormatter {
    constructor(handers: FStringHandler, align: FStringAlign, options: FStringOptions);
    format(msg: string, ...args: any): string;
    patch(handlers: FStringHandler, align: FStringAlign): FStringLikeFormatter;
}

declare var DefaultFStringFormatter: FStringLikeFormatter;


type DateHanler<T> = Record<string, (v: T) => string>;

interface DateOptions {
    mark?: string;
}

declare class DateLikeFormatter<T> {
    constructor(handlers: DateHanler<T>, options?: DateOptions);
    format(msg: string, v: T): string;
    patch(patch: DateHanler<T>): DateLikeFormatter<T>;
}

declare var DefaultDateFormatter: DateLikeFormatter<Date>;

declare function format(msg: string, ...args: any): string;

declare function format_date(msg: string, date: Date): string;

declare function patch_default_format(
    handlers?: FStringHandler,
    align?: FStringAlign
): FStringLikeFormatter;


declare function patch_default_format_date(
    handlers: DateHanler<Date>
): DateLikeFormatter<Date>;
