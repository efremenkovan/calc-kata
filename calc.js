const Calculator = function() {
  this.evaluate = string => {
    if (string.split(' ').length === 1) return string;
    if (string.split(' ').length === 3) return this.calc(string.split(' '));

    let expr_in_par = string.match(/\(.*\)/)
    while (expr_in_par) {
      string = string.replace(expr_in_par[0], this.evaluate(expr_in_par[0].substring(1, expr_in_par[0].length - 1)));
      expr_in_par = string.match(/\(\.*\)/);
    }
    
    const digitRegex = '\\d+(\\.\\d+(e.?\\d+(\\.\\d+)?)?)?'
    const expressions = [
      new RegExp('\\-?' + digitRegex + '\\s[\\*\\/]\\s\\-?' + digitRegex),
      new RegExp('\\-?' + digitRegex + '\\s[\\+\\-]\\s\\-?' + digitRegex)
    ]

    let current_expr = 0;
    let res = (() => {
      let d = string.match(expressions[current_expr])
      while(!d && current_expr <= expressions.length - 1) {
        d = string.match(expressions[++current_expr])
      }
      return d;
    })();

    while (res) {
      string = string.replace(res[0], this.calc(res[0].split(" ")));
      res = string.match(expressions[current_expr]);

      if (!res && expressions[++current_expr]) {
        console.log(string);
        res = string.match(expressions[current_expr])
      }
    }

    return string
  }
  
  this.calc = ([d1, sign, d2]) => {
    d1 = this.stringToNum(d1)
    d2 = this.stringToNum(d2)

    console.log(d1, sign ,d2);

    let ans;
    switch (sign) {
        case '+':
          ans = d1 + d2;
          break;
        case '*':
          ans = d1 * d2;
          break;
        case '/':
          ans = d1 / d2;
          break;
        case '-':
          ans = d1 - d2;
          break;
    }

    return ans.toString();
  }

  this.stringToNum = num => {
    return num.match(/^[-+]?[1-9]\.[0-9]+e[-]?[1-9][0-9]*$/)
      ? parseFloat((+num).toFixed(this.getPrecision(num)))
      : parseFloat(num);
  }

  this.getPrecision = num => {
    let arr = new Array();
    // Get the exponent after 'e', make it absolute.  
    arr = num.split('e');
    const exponent = Math.abs(arr[1]);

    // Add to it the number of digits between the '.' and the 'e'
    // to give our required precision.
    let precision = new Number(exponent);
    arr = arr[0].split('.');
    precision += arr[1].length;

    return precision;
  }
};