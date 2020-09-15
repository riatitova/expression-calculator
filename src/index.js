function eval() {
    // Do not use eval!!!
    return;
}

function brackets(s) {
    let lastOpen;
    let lastClose;
    let newStr = '';
    for (let i = s.length - 1; i >= 0; i--) {
        if (s[i] == '(') {
            lastOpen = i;
            break;
        }
    }
    for (let i = lastOpen; i < s.length; i++) {
        if (s[i] == ')') {
            lastClose = i;
            break;
        }

    }
    for (let i = lastOpen + 1; i < lastClose; i++) {
        newStr += s[i];
    }


    return newStr;

} 

function parseMultiply(st) {
    let multiply;
    let secondOp = '';
    let firstOp = '';
    let before;
    let after;
    let res;
    for (let i = st.length - 1; i >= 0; i--) {
        if (st[i] == '*') {
            multiply = i;
            break;
        }
    }
    for (let i = multiply + 1; i < st.length; i++) {
        if (st[i] == '*' || st[i] == '/' || st[i] == '+' || st[i] == '-') {
            after = i;
            break;
        } else {
            after = st.length;
        }
    }
    for (let i = multiply + 1; i < after; i++) {
            secondOp += st[i];
    }

    for (let i = multiply - 1; i >= 0; i--) {
        if (st[i] == '*' || st[i] == '/' || st[i] == '+' || st[i] == '-') {
            before = i;
            break;
        } else {
            before = -1;
        }
    }

    for (let i = before + 1; i < multiply; i++) {
            firstOp += st[i];
    }

    res = firstOp * secondOp;

    st = st.replace(st.slice(before + 1, after), res);

    return st;

}

function parseDiv(st) {
    let div;
    let secondOp = '';
    let firstOp = '';
    let before;
    let after;
    let res;
    for (let i = st.length - 1; i >= 0; i--) {
        if (st[i] == '/') {
            div = i;
            break;
        }
    }
    for (let i = div + 1; i < st.length; i++) {
        if (st[i] == '*' || st[i] == '/' || st[i] == '+' || st[i] == '-') {
            after = i;
            break;
        } else {
            after = st.length;
        }
    }
    for (let i = div + 1; i < after; i++) {
            secondOp += st[i];
    }

    for (let i = div - 1; i >= 0; i--) {
        if (st[i] == '*' || st[i] == '/' || st[i] == '+' || st[i] == '-') {
            before = i;
            break;
        } else {
            before = -1;
        }
    }

    for (let i = before + 1; i < div; i++) {
            firstOp += st[i];
    }

    if (secondOp == 0) {
        throw new Error('TypeError: Division by zero.');
    }
    res = firstOp / secondOp;

    st = st.replace(st.slice(before + 1, after), res);

    return st;
}

function parseSumSub(st) {
    let firstPlus;
    let firstMinus;
    let res;
    let type;
    let operator;
    let first = '';
    let second = '';
    let nextArg; 
    let minus;
    if(st[0] == '-') {
        minus = -1;
        st = st.slice(1);
    } else {
        minus = 1;
    }
    for (let i = 0; i < st.length; i++) {
        if (st[i] == '+') {
            firstPlus = i;
            break;
        }
    }

    for (let i = 0; i < st.length; i++) {
        if (st[i] == '-') {
            firstMinus = i;
            break;
        }
    }
    if (typeof firstMinus === 'undefined') {
        firstMinus = -1;
    }
    if (typeof firstPlus === 'undefined') {
        firstPlus = -1;
    }

    if (firstPlus == -1 && firstMinus == -1) {
        return st;
    }

    if ((firstPlus > 0 && firstPlus < firstMinus) || firstMinus == -1) {
        type = 1;
        operator = firstPlus;
    }

    if ((firstMinus > 0 && firstMinus < firstPlus) || firstPlus == -1) {
        type = -1;
        operator = firstMinus;
    }
    for (let i = 0; i < operator; i++) {
        first += st[i];
    }

    for (let i = operator + 1; i < st.length; i++) {
        if (st[i] == '+' || st[i] == '-') {
            nextArg = i;
            break;
        } else {
            nextArg = st.length;
        }
    }

    for (let i = operator + 1; i < nextArg; i++) {
        second += st[i];
    }

    res = minus * first + type * second;


    st = st.replace(st.slice(0, nextArg), res);
    return st;

}

function expressionCalculator(expr) {
    // write your solution here
    let res;
    let func;
    expr = expr.replace(/\s/g, '');

    while (expr.includes('*')) {
      expr = parseMultiply(expr);
    }
    while (expr.includes('/')) {
        expr = parseDiv(expr);
    }

    while (expr.includes('+') || expr.includes('-')) {
        expr = parseSumSub(expr);
    }

    res = expr;
    return parseFloat(res);


   

}

module.exports = {
    expressionCalculator
}