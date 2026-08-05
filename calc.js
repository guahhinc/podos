// calc.js - Complete Standalone Scientific Calculator for podOS
var eq = "";
var res = "0";

// Live Math Evaluator in Pure JavaScript
function evalMath(expr) {
    if (!expr || expr.length == 0) return "0";
    try {
        var clean = expr;
        clean = clean.replace(/pi/g, "3.14159265");
        clean = clean.replace(/e/g, "2.71828182");
        clean = clean.replace(/sin\(/g, "Math.sin(");
        clean = clean.replace(/cos\(/g, "Math.cos(");
        clean = clean.replace(/tan\(/g, "Math.tan(");
        clean = clean.replace(/sqrt\(/g, "Math.sqrt(");
        clean = clean.replace(/abs\(/g, "Math.abs(");
        clean = clean.replace(/log\(/g, "Math.log10(");
        clean = clean.replace(/ln\(/g, "Math.log(");
        clean = clean.replace(/\^/g, "**");

        var val = system.eval(clean);
        if (val === undefined || isNaN(val)) return "Error";
        
        var str = String(val);
        if (str.length > 12) str = str.substring(0, 12);
        return str;
    } catch(e) {
        return "Error";
    }
}

// UI Renderer
function render() {
    gfx.clear("black");
    gfx.drawTopBar();
    gfx.fillRect(0, 14, 240, 14, "dark_purple");
    gfx.print(2, 15, "Scientific Calculator", "white");

    // Equation and Live Result
    gfx.print(2, 38, "Eq: " + eq + "_", "cyan");
    gfx.print(2, 68, "= " + res, "light_purple");

    // Shortcut Legend
    gfx.print(2, 105, "Fn+ S:sin C:cos T:tan R:sqrt", "white");
    gfx.update();
}

// Keystroke Handler
function handleKey(k, isFn) {
    if (k == "del") {
        if (eq.length > 0) eq = eq.substring(0, eq.length - 1);
    } else if (k == "enter") {
        if (res != "Error") eq = res;
    } else if (isFn) {
        if (k == "s" || k == "S") eq += "sin(";
        else if (k == "c" || k == "C") eq += "cos(";
        else if (k == "t" || k == "T") eq += "tan(";
        else if (k == "r" || k == "R") eq += "sqrt(";
        else if (k == "p" || k == "P") eq += "pi";
    } else {
        eq += k;
    }
    res = evalMath(eq);
}

// App Execution Entry Point
render();

while (system.isRunning()) {
    var k = keyboard.getKey();
    var isFn = keyboard.isFn();
    if (k != "") {
        handleKey(k, isFn);
        render();
    }
    system.sleep(50);
}
