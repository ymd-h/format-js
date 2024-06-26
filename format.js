/// <reference types="./format.d.ts" />

const SPECIAL = ["^", "$", ".", "+", "?", "*", "(", ")"];

class FStringLikeFormatter {
    constructor(handlers, align, options){
        options ??= {};

        /** @type {number} */
        this.precision = options.defaultPrecision ?? 6;

        /** @type {Map<string, function(*, number): string>} */
        this.handlers = new Map(Object.entries(handlers));

        /** @type {Map<string, function(string, number): string>} */
        this.align = new Map(Object.entries(align));

        const fmt = Array.from(
            this.handlers.keys(),
            k => SPECIAL.includes(k) ? `\\${k}` :
                (k.length === 1) ? k :
                `(?:${k})`,
        ).join("|");

        const a = Array.from(this.align.keys()).filter(k => k !== "").map(
            aa => SPECIAL.includes(aa) ? `\\${aa}` :
                (aa.length === 1) ? aa :
                `(?:${aa})`,
        ).join("|");


        this.re = new RegExp(`{(?<idx>[0-9]+)(?::(?<align>(?:${a}))?(?<width>[0-9]*)(?:\\.(?<precision>[0-9]+))?(?<fmt>(?:${fmt})))?}`, "g");
    }

    format(msg, ...args){
        return msg.replaceAll(
            this.re,
            (...[
                , // match
                , // idx
                , // align
                , // width
                , // precision
                , // fmt,
                , // offset
                , // string
                { idx, align, width, precision, fmt },
            ]) => {
                idx = parseInt(idx);

                const v = args[idx];
                if(v === undefined){
                    return "undefined";
                }

                if(fmt === undefined){
                    return v.toString();
                }

                const f = this.handlers.get(fmt);
                if(f === undefined){
                    throw new Error(`Unknown Format at ${idx}: ${fmt}`);
                }

                precision ??= this.precision;
                let vv = f(v, precision);

                if(width !== ""){
                    width = parseInt(width);

                    align ??= "";
                    const g = this.align.get(align);
                    if(g === undefined){
                        throw new Error(`Unknown Align: ${align}`);
                    }

                    vv = g(vv, width);
                }

                return vv;
            },
        );
    }

    patch(handlers, align){
        handlers ??= {};
        align ??= {};

        return new FStringLikeFormatter(
            { ...Object.fromEntries(this.handlers.entries()), ...handlers },
            { ...Object.fromEntries(this.align.entries()), ...align },
            { defaultPrecision: this.precision },
        );
    }
};

const DefaultFStringFormatter = new FStringLikeFormatter(
    {
        "s": (v, precision) => v.toString(),
        "b": (v, precision) => Math.round(v).toString(2),
        "c": (v, precision) => String.fromCodePoint(v),
        "d": (v, precision) => v.toFixed(0),
        "o": (v, precision) => Math.round(v).toString(8),
        "x": (v, precision) => Math.round(v).toString(16),
        "X": (v, precision) => Math.round(v).toString(16).toUpperCase(),
        "e": (v, precision) => v.toExponential(precision),
        "E": (v, precision) => v.toExponential(precision).toUpperCase(),
        "f": (v, precision) => v.toFixed(precision).toLowerCase(),
        "F": (v, precision) => v.toFixed(precision).toUpperCase(),
        "%": (v, precision) => (v * 100).toFixed(precision) + "%",
    },
    {
        "<": (v, width) => v.padEnd(width),
        "^": (v, width) => v.padStart(Math.floor(width / 2)).padEnd(width),
        ">": (v, width) => v.padStart(width),
        "" : (v, width) => v.padStart(width),
    },
);


const format = (msg, ...args) => DefaultFStringFormatter.format(msg, ...args);

const patch_default_format = (handlers, align) => DefaultFStringFormatter.patch(handlers, align);

class DateLikeFormatter {
    constructor(handlers, options){
        options ??= {};

        const mark = options.mark ?? "%";

        if(typeof mark !== "string"){
            new Error(`'mark' must be string, but ${typeof mark}`);
        }
        if(mark.length !== 1){
            new Error(`'mark' must be single letter, but: ${mark}`);
        }
        this.mark = mark;

        /** @type {Map<string, function(T): string>} */
        this.handlers = new Map(Object.entries(handlers));

        const re = Array.from(this.handlers.keys(),
                              k => (k.length === 1) ? k : `(?:${k})`).join("|");
        this.re = new RegExp(`(${this.mark}+)(${re})`, "g");
    }

    format(msg, v){
        return msg.replaceAll(
            this.re,
            (_, esc, fmt) => {
                const even = ((esc.length % 2) === 0);
                esc = esc.substring(0, Math.floor(esc.length / 2));

                if(even){
                    return esc + fmt;
                }

                const f = this.handlers.get(fmt);
                if(f === undefined){
                    throw new Error(`Unknown Format: ${fmt}`);
                }

                return esc + f(v);
            });
    }

    patch(handlers){
        return new DateLikeFormatter(
            {...Object.fromEntries(this.handlers.entries()), ...handlers},
            { mark: this.mark },
        )
    }
};

const DefaultDateFormatter = new DateLikeFormatter(
    {
        y: date => (date.getFullYear() % 100).toFixed(0).padStart(2, "0"),
        Y: date => date.getFullYear().toFixed(0).padStart(4, "0"),
        m: date => (date.getMonth() + 1).toFixed(0).padStart(2, "0"),
        d: date => date.getDate().toFixed(0).padStart(2, "0"),
        H: date => date.getHours().toFixed(0).padStart(2, "0"),
        I: date => {
            let I = date.getHours() % 12;
            if(I === 0){
                I = 12;
            }
            return I.toFixed(0).padStart(2, "0");
        },
        p: date => date.getHours() < 12 ? "AM" : "PM",
        M: date => date.getMinutes().toFixed(0).padStart(2, "0"),
        S: date => date.getSeconds().toFixed(0).padStart(2, "0"),
        s: date => (date.getTime() / 1000).toFixed(0),
        f: date => date.getMilliseconds().toFixed(0).padStart(3, "0"),
        T: date => (date.getHours().toFixed(0).padStart(2, "0") + ":" +
                    date.getMinutes().toFixed(0).padStart(2, "0") + ":" +
                    date.getSeconds().toFixed(0).padStart(2, "0")),
        w: date => date.getDay().toFixed(0),
    },
);

const format_date = (msg, date) => DefaultDateFormatter.format(msg, date);

const patch_default_format_date = (handlers) => DefaultDateFormatter.patch(handlers);

export {
    format as default,
    format,
    format_date,
    patch_default_format,
    patch_default_format_date,
    FStringLikeFormatter,
    DateLikeFormatter,
};
