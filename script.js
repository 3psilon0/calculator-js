const calcDispUp = document.getElementById("calc-display-upper");
const calcDispLow = document.getElementById("calc-display-lower");
const calcButtons = document.getElementById("calc-buttons");

const digits = {
    "zero-btn": "0",
    "one-btn": "1",
    "two-btn": "2",
    "three-btn": "3",
    "four-btn": "4",
    "five-btn": "5",
    "six-btn": "6",
    "seven-btn": "7",
    "eight-btn": "8",
    "nine-btn": "9",
};

const operators = {
    "divide-btn": "÷",
    "mult-btn": "×",
    "minus-btn": "-",
    "plus-btn": "+",
    "mod-btn": "mod"
};

const Calculator = function () {
    let x = "";
    let y = null;
    let opr = null;
    let prevExpr = null;

    const add = () => Number(x) + Number(y);
    const multiply = () => Number(x) * Number(y);
    const subtract = () => Number(x) - Number(y);
    const divide = () => {
        if (Number(y) === 0) {
            throw new Error("Math Error");
        } else {
            return Number(x) / Number(y);
        }
    };
    const modulo = () => Number(x) % Number(y);

    const hasOpr = () => opr != null;

    const operate = () => {
        try {
            let result;
            if (x === "") {
                x = "0";
            }
            switch (opr) {
                case "+":
                    result = add();
                    break;
                case "-":
                    result = subtract();
                    break;
                case "×":
                    result = multiply();
                    break;
                case "÷":
                    result = divide();
                    break;
                case "mod":
                    result = modulo();
                    break;
                default:
                    return x.toString();
                    break;
            }
            return result.toString();
        } catch (err) {
            throw err;
        }
    };

    const insertPoint = () => {
        if (prevExpr === null) {
            if (y === null) {
                if (!hasOpr()) {
                    x = x === "" ? "0" : x;
                    x = x.indexOf(".") === -1 ? x + "." : x;
                    return `${x}`;
                } else {
                    y = "0.";
                }
            } else {
                y = y.indexOf(".") === -1 ? y + "." : y;
            }
            return `${x} ${opr} ${y}`;
        } else {
            if (y === null) {
                y = "0.";
            } else {
                y = y.indexOf(".") === -1 ? y + "." : y;
            }
            return `${prevExpr} ${opr} ${y}`;
        }
    };

    const invert = () => {
        if (prevExpr === null) {
            if (!hasOpr()) {
                if (x === "" || x === "0") {
                    x = "0";
                    return x;
                }
                x = x.search(/^-{1}.*/) === -1 ? "-" + x : x.slice(1);
                return `${x}`;
            } else {
                if (y === null) {
                    return `${x} ${opr}`;
                } else {
                    y = y.search(/^-{1}.*/) === -1 ? "-" + y : y.slice(1);
                    return `${x} ${opr} ${y}`;
                }
            }
        } else {
            if (y === null) {
                x = x.search(/^-{1}.*/) === -1 ? "-" + x : x.slice(1);
                prevExpr = RegExp(/^-{1}\(.*\)/).test(prevExpr)
                    ? prevExpr.slice(2, prevExpr.length - 1)
                    : `-(${prevExpr})`;
                return `${prevExpr} ${opr}`;
            } else {
                y = y.search(/^-{1}.*/) === -1 ? "-" + y : y.slice(1);
                return `${prevExpr} ${opr} ${y}`;
            }
        }
    };

    const getFullExpr = (char) => {
        let expr;
        if (calc.hasOpr()) {
            y = y === null ? "" + char : y + char;
            x = x.replace(/^0{2,}/, "0");
            y = y.replace(/^0{2,}/, "0");
            expr =
                prevExpr === null
                    ? `${x} ${opr} ${y}`
                    : `${prevExpr} ${opr} ${y}`;
            return expr;
        } else {
            x += char;
            x = x.replace(/^0{1,}/, "0");
            return `${x}`;
        }
    };

    const getHalfExpr = () => {
        let expr = prevExpr === null ? `${x} ${opr}` : `${prevExpr} ${opr}`;
        return expr;
    };

    const reset = () => {
        x = "";
        y = opr = prevExpr = null;
    };

    return {
        get x() {
            return x;
        },
        set x(num) {
            x = num;
        },
        get y() {
            return y;
        },
        set y(num) {
            y = num;
        },
        get opr() {
            return opr;
        },
        set opr(oper) {
            opr = oper;
        },
        get prevExpr() {
            return prevExpr;
        },
        set prevExpr(expr) {
            prevExpr = expr;
        },
        operate: operate,
        reset: reset,
        getFullExpr: getFullExpr,
        getHalfExpr: getHalfExpr,
        insertPoint: insertPoint,
        invert: invert,
        hasOpr: hasOpr,
    };
};

const calc = Calculator();
calcButtons.addEventListener("click", (e) => {
    switch (e.target.id) {
        case "zero-btn":
        case "one-btn":
        case "two-btn":
        case "three-btn":
        case "four-btn":
        case "five-btn":
        case "six-btn":
        case "seven-btn":
        case "eight-btn":
        case "nine-btn":
            calcDispUp.innerText = calc.getFullExpr(digits[e.target.id]);
            if (calc.y != null) {
                try {
                    calcDispLow.innerText = calc.operate();
                } catch (e) {
                    calcDispLow.innerText = e.message;
                    calc.y = null;
                    calcDispUp.innerText = calc.getHalfExpr() + " 0";
                }
            }
            break;
        case "divide-btn":
        case "mult-btn":
        case "minus-btn":
        case "plus-btn":
        case "mod-btn":
            if (calc.y != null) {
                calc.prevExpr = calcDispUp.innerText;
                calc.x = calc.operate();
                calc.opr = operators[e.target.id];
                calc.y = null;
                calcDispUp.innerText = calc.getHalfExpr();
                calcDispLow.innerText = "\u2800";
            } else if (calc.y === null) {
                calc.x = calc.x === "" ? "0" : calc.x;
                calc.opr = operators[e.target.id];
                calcDispUp.innerText = calc.getHalfExpr();
                calcDispLow.innerText = "\u2800";
            }
            break;
        case "invert-btn":
            try {
                calcDispUp.innerText = calc.invert();
                calcDispLow.innerText = calc.operate();
            } catch (e) {
                calcDispUp.innerText = "\u2800";
                calcDispLow.innerText = e.message;
                calc.reset();
            }
            break;
            case "point-btn":
                calcDispUp.innerText = calc.insertPoint();
            break;
        case "equals-btn":
            {
                try {
                    const result = calc.operate();
                    calc.reset();
                    calc.x = result;
                    calcDispUp.innerText = result;
                    calcDispLow.innerText = result;
                } catch (e) {
                    calcDispUp.innerText = "\u2800";
                    calcDispLow.innerText = e.message;
                    calc.reset();
                }
            }
            break;
        case "clear-btn":
            calc.reset();
            calcDispLow.innerText = "\u2800";
            calcDispUp.innerText = "0";
            break;
    }
});
