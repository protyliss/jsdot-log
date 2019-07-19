const $colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    underscore: '\x1b[4m',
    blink: '\x1b[5m',
    reverse: '\x1b[7m',
    hidden: '\x1b[8m',
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    bgBlack: '\x1b[40m',
    bgRed: '\x1b[41m',
    bgGreen: '\x1b[42m',
    bgYellow: '\x1b[43m',
    bgBlue: '\x1b[44m',
    bgMagenta: '\x1b[45m',
    bgCyan: '\x1b[46m',
    bgWhite: '\x1b[47m'
};

type TextColor = 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan';
const textColors = ['red', 'green', 'yellow', 'blue', 'magenta', 'cyan'];

const {reset} = $colors;

const _colorWrap = /\(([a-z.]+):(.+)\)/g;
const _colorArrow = /^([a-z.]+)=>$/;

export class Log {
    _prefix = '';

    static RESET = 'reset=>';
    static BRIGHT = 'bright=>';
    static DIM = 'dim=>';
    static UNDERSCORE = 'underscore=>';
    static BLINK = 'blink=>';
    static REVERSE = 'reverse=>';
    static HIDDEN = 'hidden=>';
    static BLACK = 'black=>';
    static RED = 'red=>';
    static GREEN = 'green=>';
    static YELLOW = 'yellow=>';
    static BLUE = 'blue=>';
    static MAGENTA = 'magenta=>';
    static CYAN = 'cyna=>';
    static WHITE = 'white=>';
    static BGBLACK = 'bgblack=>';
    static BGRED = 'bgred=>';
    static BGGREEN = 'bggreen=>';
    static BGYELLOW = 'bgyellow=>';
    static BGBLUE = 'bgblue=>';
    static BGMAGENTA = 'bgmagenta=>';
    static BGCYAN = 'bgcyan=>';
    static BGWHITE = 'bgwhite=>';

    protected flagIndex = 0;

    constructor(_parent?: Log, prefix?: string | string[]);
    constructor(protected _parent, prefix) {
        if (_parent) {
            if (prefix) {
                if (!Array.isArray(prefix)) {
                    prefix = [prefix];
                }

                this._prefix = '[' + setColorMap(prefix.join('')) + ']';
            }
        } else {
            this._parent = {
                getPrefix() {
                    return '[' + getTime() + ']'
                }
            };
        }
    }

    log(...messages) {
        console.log(this.getPrefix(), ...messages.map(setColorMap), reset);
    }

    info(...messages) {
        console.info(this.getPrefix(), ...messages.map(setColorMap), reset);
    }

    warn(...messages) {
        console.warn(this.getPrefix(), ...messages.map(setColorMap), reset);
    }

    error(...messages) {
        console.error(this.getPrefix(), ...messages.map(setColorMap), reset);
    }

    group(...messages) {
        console.group(this.getPrefix(), ...messages.map(setColorMap), reset);
    }

    groupEnd() {
        console.groupEnd();
    }

    child(prefix: string | string[]) {
        return new Log(this, prefix);
    }

    getPrefix() {
        return this._parent.getPrefix() + this._prefix;
    }

    title(message) {
        console.log('');
        console.log('');
        console.log('');
        console.log(message);
        console.log(getLine('=', message.length));
    }

    subTitle(message) {
        console.log('');
        console.log(message);
        console.log(getLine('-', message.length));
    }

    // flag(color?: TextColor);
    // flag(color) {
    //     if (!color) {
    //         if (++this.flagIndex > textColors.length) {
    //             this.flagIndex = 0;
    //         }
    //         color = $colors[textColors[this.flagIndex]];
    //     }
    //     console.log(color, '>>>>>----------------------->', reset);
    // }

    capture(...messages) {
        const line = $colors.red + getLine('*', 80);

        console.log(line);
        console.log(...messages);
        console.log(line, reset);
    }

    in(...message) {
        const arrow = '>>>>>----------------------->';
        console.log($colors.yellow);
        console.log(arrow);
        console.log(...message);
        console.log(arrow);
        console.log(reset);
    }

    out(...message) {
        const arrow = '<-----------------------<<<<<';
        console.log($colors.blue);
        console.log(arrow);
        console.log(...message);
        console.log(arrow);
        console.log(reset);
    }
}

function setColorMap(message: string): string;
function setColorMap(message) {
    if (typeof message !== 'string') {
        return message;
    }
    const arrowed = message.match(_colorArrow);
    return arrowed ?
        getColors(arrowed[1]) :
        message.replace(_colorWrap, setColor);
}

function setColor(substring: string, colors: string, value: string): string;
function setColor(substring, colors, value) {
    return getColors(colors) + value + $colors.reset;
}

function getColors(colors: string): string;
function getColors(colors) {
    return colors.split('.').map(getColorMap).join('');
}

function getColorMap(color: string): string;
function getColorMap(color) {
    return $colors[color] || $colors.reset;
}

const $lines: {
    [key: string]: {
        [key: number]: string
    }
}
    = {};

function getLine(char: string, size: number): string;
function getLine(char, size) {
    if (!$lines[char]) {
        $lines[char] = {};
    }
    if (!$lines[char][size]) {
        let line = '';
        while (size-- > 0) {
            line += char;
        }
        $lines[char][size] = line;
    }
    return $lines[char][size];
}

function getTime() {
    const date = new Date;
    return [
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
    ]
        .map(zerofill)
        .join(':');
}

function zerofill(value: number): string | number;
function zerofill(value) {
    return value < 10 ?
        '0' + value :
        value;
}
