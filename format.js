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


const DateExp = /(%+)(y|Y|m|d|H|I|p|M|S|s|f|T|w)/g;

/**
 * @param {string} msg
 * @param {Date} date
 * @returns {string}
 */
const format_date = (msg, date) => msg.replaceAll(
    DateExp,
    (...[
        , // match
        esc,
        fmt,
        , // offset
        , // string
        , // group
    ]) => {
        if((esc.length % 2) === 0){
            return esc.substring(0, esc.length / 2) + fmt;
        }

        let v = esc.substring(0, Math.floor(esc.length / 2));

        switch(fmt){
        case "y":
            return v + (date.getFullYear() % 100).toFixed(0).padStart(2, "0");
            break;
        case "Y":
            return v + date.getFullYear().toFixed(0).padStart(4, "0");
        case "m":
            return v + (date.getMonth() + 1).toFixed(0).padStart(2, "0");
        case "d":
            return v + date.getDate().toFixed(0).padStart(2, "0");
        case "H":
            return v + date.getHours().toFixed().padStart(2, "0");
        case "I":
            let I = date.getHours() % 12;
            if(I === 0){
                I = 12;
            }
            return v + I.toFixed(0).padStart(2, "0");
        case "p":
            return v + (date.getHours() <= 12 ? "AM" : "PM");
        case "M":
            return v + date.getMinutes().toFixed(0).padStart(2, "0");
        case "S":
            return v + date.getSeconds().toFixed(0).padStart(2, "0");
        case "s":
            return v + (date.getTime() / 1000).toFixed(0);
        case "f":
            return v + date.getMilliseconds().toFixed(0).padStart(3, "0");
        case "T":
            return v + (date.getHours().toFixed(0).padStart(2, "0") + ":" +
                        date.getMinutes().toFixed(0).padStart(2, "0") + ":" +
                        date.getSeconds().toFixed(0).padStart(2, "0"));
        case "w":
            return v + date.getDay();
        default:
            throw new Error(`Unknown Format: ${fmt}`);
        }
    },
);

export { format, format_date, format as default };

