/** @module format */

/** @type {RegExp} */
const ArgExp = /{(?<idx>[0-9]+)(?::(?<align><|\^|>)?(?<width>[0-9]*)(?:\.(?<precision>[0-9]+))?(?<fmt>(?:s|b|c|d|o|x|X|e|E|f|F|%)))?}/g;

/** @type {number} */
const defaultPresicion = 6;

/**
 * @param {string} msg
 * @param {*[]} args
 */
const format = (msg, ...args) => msg.replaceAll(
    ArgExp,
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

        let vv = null;
        precision ??= defaultPresicion;

        switch(fmt){
        case "s":
            vv = v.toString();
            break;
        case "b":
            vv = Math.round(v).toString(2);
            break;
        case "c":
            vv = String.fromCodePoint(v);
            break;
        case "d":
            vv = v.toFixed(0);
            break;
        case "o":
            vv = Math.round(v).toString(8);
            break;
        case "x":
            vv = Math.round(v).toString(16);
            break;
        case "X":
            vv = Math.round(v).toString(16).toUpperCase();
            break;
        case "e":
            vv = v.toExponential(precision);
            break;
        case "E":
            vv = v.toExponential(precision).toUpperCase();
            break;
        case "f":
            vv = v.toFixed(precision);
            break;
        case "F":
            vv = v.toFixed(precision).toUpperCase();
            break;
        case "%":
            vv = (v * 100).toFixed(precision);
            break;
        default:
            throw new Error(`Unknown Format at ${idx}: ${fmt}`);
        }

        if(width !== undefined){
            width = parseInt(width);
            switch(align){
            case "<":
                vv = vv.padEnd(width);
                break;
            case "^":
                vv = vv.padStart(Math.floor(width / 2)).padEnd(width);
                break;
            case ">":
                // pass
            default:
                vv = vv.padStart(width);
                break;
            }
        }

        return vv;
    },
);


class DateLikeFormatter {
    /**
     * @template T
     * @param {string} mark
     * @param {Object.<string, function(T): string} routing
     */
    constructor(mark, routing){
        if(typeof mark !== "string"){
            new Error(`'mark' must be string, but ${typeof mark}`);
        }
        if(mark.length !== 1){
            new Error(`'mark' must be single letter, but: ${mark}`);
        }

        /** Map<string, function(T): string> */
        this.routing = new Map(Object.entries(routing));

        const re = Array.from(this.routing.keys(),
                              k => (k.length === 1) ? k : `(?:${k})`).join("|");
        this.re = new RegExp(`(${mark}+)(${re})`, "g");
    }

    /**
     * @param {string} msg
     * @param {T} v
     * @returns {string}
     */
    format(msg, v){
        return msg.replaceAll(
            this.re,
            (_, esc, fmt) => {
                const even = ((esc.length % 2) === 0);
                esc = esc.substring(0, Math.floor(esc.length / 2));

                if(even){
                    return esc + fmt;
                }

                const f = this.routing.get(fmt);
                if(f === undefined){
                    throw new Error(`Unknown Format: ${fmt}`);
                }

                return f(v);
            });
    }
};

const DefaultDateFormatter = new DateLikeFormatter(
    "%",
    {
        y: date => (date.getFullYear() % 100).toFixed(0).padStart(2, "0"),
        Y: date => date.getFullYear().toFixed(0).padStart(4, "0"),
        m: date => (date.getMonth() + 1).toFixed(0).padStart(2, "0"),
        d: date => date.getDate().toFixed(0).padStart(2, "0"),
        H: date => date.getHours().toFixed().padStart(2, "0"),
        I: date => {
            let I = date.getHours() % 12;
            if(I === 0){
                I = 12;
            }
            return I.toFixed(0).padStart(2, "0");
        },
        p: date => date.getHours() <= 12 ? "AM" : "PM",
        M: date => date.getMinutes().toFixed(0).padStart(2, "0"),
        S: date => date.getSeconds().toFixed(0).padStart(2, "0"),
        s: date => (date.getTime() / 1000).toFixed(0),
        f: date => date.getMilliseconds().toFixed(0).padStart(3, "0"),
        T: date => (date.getHours().toFixed(0).padStart(2, "0") + ":" +
                    date.getMinutes().toFixed(0).padStart(2, "0") + ":" +
                    date.getSeconds().toFixed(0).padStart(2, "0")),
        w: date => date.getDay(),
    },
);


/**
 * @param {string} msg
 * @param {Date} date
 * @returns {string}
 */
const format_date = (msg, date) => DefaultDateFormatter.format(msg, date);

export { format, format_date, format as default };
