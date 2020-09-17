function eval() {
    // Do not use eval!!!
    return;
}
function checkBrackets(s) {
    let check = 0;
    for (let i = 0; i < s.length; i++) {
        if (s[i] == '(') {
            check++;
        } else if (s[i] == ')') {
            check--;
        }
    }
    if (check != 0) {
        throw new Error('ExpressionError: Brackets must be paired');
    }

}

function brackets(s) {
    checkBrackets(s);
    let lastOpen;
    let lastClose;
    let newStr = '';
    let res;
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

    while (newStr.includes('*') || newStr.includes('/')) {
        newStr = parseMultiplyDiv(newStr);
    }
      
    while (newStr.includes('+') || newStr.includes('-')) {
  
        if(newStr[0] == '-' && !newStr.slice(1).includes('-') && !newStr.includes('+')) {
            break;
        }
        newStr = parseSumSub(newStr);
    }
      res = newStr;
      s = s.replace(s.slice(lastOpen, lastClose + 1), res);
      
      return s;


} 

function parseMultiplyDiv(st) {
    let operator;
    let secondOp = '';
    let firstOp = '';
    let before;
    let after;
    let res;
    let div = 0;
    let minus = 1;
    let minus2 = 1;
    let newst = [];
   
    for (let i = 0; i < st.length; i++) {
        if ((st[i] == '*') || (st[i] == '/')) {
            operator = i;
            if (st[i] == '/') {
                div = 1;
            }
            break;
        }
    }
    //check a minus before second number
    if(st[operator + 1] == '-') {
        minus2 = -1;
        for (let k = 0; k < st.length; k++) {
            if (k == operator + 1) {
                newst.push('');
            } else {
                newst.push(st[k]);
            }
        }
        st = newst.join('');
    } else {
        minus2 = 1;
    }
    //look for a next operator
    for (let i = operator + 1; i < st.length; i++) {
        if (st[i] == '*' || st[i] == '/' || st[i] == '+' || st[i] == '-') {
            after = i;
            break;
        } else {
            after = st.length;
        }
    }

    for (let i = operator + 1; i < after; i++) {
            secondOp += st[i];
    }
    
    //look for a previous operator
    for (let i = operator - 1; i >= 0; i--) {
        if (st[i] == '*' || st[i] == '/' || st[i] == '+' || st[i] == '-') {
            before = i;
    //check a minus before first number
            if (st[before] == '-' && 
            (st[before - 1] == '+' || st[before - 1] == '-' || typeof st[before - 1] == 'undefined')) 
            {
                minus = -1;
                newst = [];
                for (let k = 0; k < st.length; k++) {
                    if (k == before) {
                        newst.push('');
                    } else {
                        newst.push(st[k]);
                    }
                }
                st = newst.join('');
                before = before - 1;
                operator--;
                after--;
            }
            break;
        } else {
            before = -1;
        }
    }

    for (let i = before + 1; i < operator; i++) {
            firstOp += st[i];
    }

    if (div == 1) {
        if (secondOp == 0) {
            throw new Error('TypeError: Division by zero.');
        }
        res = minus * firstOp / (secondOp * minus2);
    } else {
        res = minus * firstOp * (secondOp * minus2);
    }
    

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
    let minus2;
    let newst = [];
    //check a minus before first number
    if(st[0] == '-') {
        minus = -1;
        st = st.slice(1);
        if (!st.includes('-') && !st.includes('+')) {
            return '-' + st;
        }

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
            if (st[i - 1] == 'e') {
                continue;
            }
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
    //check a minus before second number
    if(st[operator + 1] == '-') {
        minus2 = -1;
        for (let k = 0; k < st.length; k++) {
            if (k == operator + 1) {
                newst.push('');
            } else {
                newst.push(st[k]);
            }
        }
        st = newst.join(''); 
    } else {
        minus2 = 1;
    }
    //look for a next operator
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

    res = minus * first + type * second * minus2;


    st = st.replace(st.slice(0, nextArg), res);
    return st;

}

function expressionCalculator(expr) {
    // write your solution here
    let res;
    expr = expr.replace(/\s/g, '');
    while (expr.includes('(') || expr.includes(')')) {
        expr = brackets(expr);
    }
    while (expr.includes('*') || expr.includes('/')) {
        expr = parseMultiplyDiv(expr);
    }
      
    while (expr.includes('+') || expr.includes('-')) {
  
        if(expr[0] == '-' && !expr.slice(1).includes('-') && !expr.includes('+')) {
            break;
        }
        expr = parseSumSub(expr);
    }
      res = expr;
    return parseFloat(res);

}

module.exports = {
    expressionCalculator
}