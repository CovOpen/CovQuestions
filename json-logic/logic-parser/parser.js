"use strict";
exports.__esModule = true;
function findClosingBracketMatchIndex(str, pos) {
    // credits to https://codereview.stackexchange.com/questions/179471/find-the-corresponding-closing-parenthesis
    if (str[pos] != '(') {
        throw new Error("No '(' at index " + pos);
    }
    var depth = 1;
    for (var i = pos + 1; i < str.length; i++) {
        switch (str[i]) {
            case '(':
                depth++;
                break;
            case ')':
                if (--depth == 0) {
                    return i;
                }
                break;
        }
    }
    return -1; // No matching closing parenthesis
}
function toJSONDatatype(val) {
    if (val == 'null') {
        return null;
    }
    if (val == 'true') {
        return true;
    }
    if (val == 'false') {
        return false;
    }
    try {
        var pVal = parseFloat(val);
        if (!Number.isNaN(pVal)) {
            return pVal;
        }
    }
    catch (_a) {
        // conversion failed
    }
    return val;
}
var Expression = /** @class */ (function () {
    function Expression(a, depth) {
        if (depth === void 0) { depth = 1; }
        this.subExpressions = {};
        this.depth = depth;
        this.raw = a;
        this.parsed = a;
        this.parse();
    }
    Expression.prototype.parse = function () {
        var exprCounter = 0;
        // loop over expression and look for opening parenthesis
        for (var i = 0; i < this.raw.length; i++) {
            if (this.raw[i] == '(') {
                // get the corresponding closing one
                var start = i;
                var end = findClosingBracketMatchIndex(this.raw, start);
                if (end > 0) {
                    // extract the subexpression
                    var subRepr = this.raw.substring(start + 1, end);
                    // create an identifier
                    var exprId = '#EXPR' + this.depth + '#' + exprCounter + '#';
                    // save subexpression
                    this.subExpressions[exprId] = {
                        start: start,
                        end: end,
                        expr: new Expression(subRepr, this.depth + 1 + exprCounter)
                    };
                    // update parsed string
                    this.parsed = this.parsed.replace(subRepr, exprId);
                    exprCounter += 1;
                    i = end;
                }
            }
        }
    };
    Expression.prototype.toJSONLogic = function () {
        // sanitze parsed string by adding space around operators
        // note the space after - to avoid casting -1*x wrong!
        var sanitizedRaw = this.parsed.replace(/\+/g, ' + ').replace(/\-\s/g, ' - ').replace(/\*/g, ' * ').replace(/\//g, ' / ').replace(/\%/g, ' % ').replace(/\</g, ' < ').replace(/\>/g, ' > ').replace(/\<\s\=/g, '<=').replace(/\>\s\=/g, '>=').replace(/\=\=/g, ' == ').replace(/\!\=/g, ' != ').replace(/\,\s/g, ',').replace(/\s\,/g, ',');
        // split string and filter empty strings
        var elements = sanitizedRaw.split(' ').filter(function (e) { return e.length > 0; }).map(function (e) {
            if (e.indexOf('.') == -1 && e.indexOf('#') == -1) {
                return e.toLowerCase();
            }
            else {
                return e;
            }
        });
        // concatenate everything --> recursive
        var c = this.chain(elements);
        return c;
    };
    Expression.prototype.checkExpression = function (item) {
        var _this = this;
        var nItem = item;
        if (typeof (nItem) == 'string' && item.startsWith('[') && item.endsWith(']')) {
            return nItem.slice(1, -1).split(',').filter(function (e) { return e.length > 0; }).map(function (e) { return _this.checkExpression(e); });
        }
        // check if it is a subexpression. If so, convert it to JSON Logic
        if (typeof (nItem) == 'string' && item.startsWith('(#') && item.endsWith('#)')) {
            return this.subExpressions[item.slice(1, -1)].expr.toJSONLogic();
        }
        // check if unary operator
        if (typeof (nItem) == 'string' && nItem.startsWith('!')) {
            return {
                "!": this.checkExpression(nItem.slice(1))
            };
        }
        if (typeof (nItem) == 'string' && nItem.startsWith('-')) {
            return {
                "-": this.checkExpression(nItem.slice(1))
            };
        }
        // check if is referencing a variable. If so, put in JSON Logic syntax
        if (typeof (nItem) == 'string' && nItem.indexOf('.') > 0) {
            var nItemDotIndex = nItem.indexOf('.');
            if (Number.isNaN(parseFloat(nItem[nItemDotIndex + 1]))) {
                var defaultValue = null;
                var varName = nItem;
                if (nItem.indexOf(':') > 0) {
                    var varSplit = nItem.split(':');
                    varName = varSplit[0];
                    defaultValue = toJSONDatatype(varSplit[1]);
                }
                return { 'var': [varName, defaultValue] };
            }
        }
        // try to convert numbers/null/...
        if (typeof (nItem) == 'string') {
            return toJSONDatatype(nItem);
        }
        return nItem;
    };
    Expression.prototype.chain = function (items) {
        var _a, _b, _c, _d;
        // if only one item, just return it
        if (items.length == 1) {
            return this.checkExpression(items[0]);
        }
        if (items.length == 2 && (items[0] == 'max' || items[0] == 'min' || items[0] == '+' || items[0] == '*')) {
            var mItems = this.checkExpression(items[1]);
            return _a = {},
                _a[items[0]] = mItems,
                _a;
        }
        if (items.length == 3) {
            var item0 = this.checkExpression(items[0]);
            var item2 = this.checkExpression(items[2]);
            return _b = {},
                _b[items[1]] = [item0, item2],
                _b;
        }
        if (items.length == 5 && (items[1] == '<' || items[1] == '<=' || items[1] == '>' || items[1] == '>=') && ((items[3] == '<' || items[3] == '<=' || items[1] == '>' || items[1] == '>='))) {
            var item0 = this.checkExpression(items[0]);
            var item2 = this.checkExpression(items[2]);
            var item4 = this.checkExpression(items[4]);
            return _c = {},
                _c[items[1]] = [item0, item2, item4],
                _c;
        }
        if (items.length == 6 && items[0] == 'if' && items[2] == 'then' && items[4] == 'else') {
            var Cond = this.checkExpression(items[1]);
            var Then = this.checkExpression(items[3]);
            var Else = this.checkExpression(items[5]);
            return {
                'if': [Cond, Then, Else]
            };
        }
        // else recursively chain them
        return _d = {},
            _d[items[1]] = [this.checkExpression(items[0]), this.chain(items.slice(2))],
            _d;
    };
    return Expression;
}());
exports.Expression = Expression;
