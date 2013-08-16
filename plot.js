var ƒ = _ƒ =  (function() {
	var root = this;	
	    
	// THE EVALUATOR
	var number = "[0-9]",
		operator = "[*+-\\/^]",
		variable = "[a-zA-Z_]";
	var identity = function(x){return x;};
	var parseParen = function(str) {
		var nested = 0,
			paren = "",
			rest = "",
			matched = false;
		for( var i = 0; i < str.length; i++ ) {
			var read = str[i];
			if( read == '(' && !matched ) {
				nested++;
				if( nested == 1 ) {
					paren = "";
				} else {
					paren += read;
				}
			} else if( read == ')' && !matched ) {
				nested--;
				if( nested == 0 ) {
					matched = true; 
				} else {
					paren += read;
				}
			} else if(matched) {
				rest += read;
			} else {
				paren += read;
			}
		}
		if( rest ) {
			var parsed = parse('_'+rest);						
			parsed.splice(1, 1, parse(paren));		
			return parsed;
		} else {
			return parse(paren);
		}
	};
	var parseOp = function(str) {
		var first = str.split(/[*+-\/^]/)[0],
			op = str.substr(first.length, 1),
			rest = str.substr(first.length + 1);
		return [op, parse(first), parse(rest)];
	};
	var just = function(pattern) {
		return new RegExp("^"+pattern+"$");
	};
	var leading = function(pattern) {
		return new RegExp("^"+pattern);
	};
	var or = function(a, b) {
		return "("+a+"|"+b+")"
	};
	var parse = function(str) {		
		var exprs = [
			[just(number), parseInt],
			[leading(or(number, variable)+operator), parseOp],
			[/^[(]/, parseParen],
			[/^/, identity]
		];
		var matched = false,
			parse;
		exprs.forEach(function(expr) {
			if( expr[0].test(str) && !matched ) {
				matched = true;
				parse = expr[1](str);
			}
		});
		return matched && parse;
	};
	var eval = function(expr, env) {
		if( typeof expr == "string" ) {
			return env[expr];
		} else if( typeof expr == 'number' ) {
			return expr;
		} else if( just(operator).test(expr[0]) ) {
			return env[expr[0]](eval(expr[1], env), eval(expr[2], env));
		}
	};
	var evalparse = function(expr, env) {
		return eval(parse(expr), env);
	};
	var extend = function(a, b) {
		var n = {};
		for(var k in a) {
			n[k] = a[k];
		}
		for(var k in b) {
			n[k] = b[k];
		}
		return n;
	};
	var ƒ = function(fns, polar) {		
		var env = {
			"+": function(a,b){return a+b},
			"*": function(a,b){return a*b},
			"^": function(a,b){return Math.pow(a, b);}
		};
		if( typeof fns == 'string' ) {
			fns = [fns];
		}		
		if(polar) {
			var eqs = fns.map(evalPolar);
			// ...
		} else {			
			if( fns.length == 1 ) {				
				f = function(x){
					return [x, evalparse(fns[0], extend(env, {x:x}))];
				};
			} else {				
				f = function(x) {
					var eqs = fns.map(function(ex){return evalparse(ex, extend(env, {x:x}));});
					return eqs;
				};
			}
		}
		
		ƒ.p = ƒ.prototype = _ƒ;
		for( var key in ƒ.p ) {
			f[key] = ƒ.p[key];
		}
		return f;
	};
	ƒ.p = ƒ.prototype = {
		constructor: ƒ,
		initPlane: function(el) {
			var thiz = this;
			ƒ("0").graph(el, 0, 1, '#666');
			ƒ(["0","x"]).graph(el, 0, 1, '#666');		
			return thiz;
		},
		y: function(x) {
			return this(x)[1];
		},
		graph: function( el, win, ax, color ) {
			var thiz = this, _f = f, f = thiz;		

			var prec = 1000,
			    elem = el,
			    win = [
					-8,	// xMin
					8,	// xMax
					-8,	// yMin
					8	// yMax
			    ];

			win[3] = [-win[2], (win[2] = -win[3])][0];	// Swap Max/Min to make more intuitive

			axies = {
				y: (elem.width*(0-win[0])/(win[1]-win[0])),
				x: (elem.height*(0-win[2])/(win[3]-win[2]))
			};
			var context = elem.getContext('2d');
				
			!ax && ƒ.initPlane(elem);									
			context.beginPath();				
			// Plot style
			context.strokeStyle = color;
			context.lineWidth   = 3;

			var sum = 0;
			for( var i = axies.y/elem.width * -1 * prec; i < (elem.width-axies.y)/elem.width * prec; i++ ) {
				var fraction = function(n) { return (n - axies.y/elem.width * -1 * prec)/prec; },
					xMin	 = win[0],
					yMin	 = win[2],
					xRange 	 = win[1] - win[0],
					yRange	 = win[3] - win[2];
				
			    context.moveTo(axies.y+f(xMin+fraction(i)*xRange)[0]/xRange*elem.width, axies.x-f(xMin+fraction(i)*xRange)[1]/yRange*elem.height); 
			    //x,y coordinate
			    context.lineTo(axies.y+f(xMin+fraction(i+1)*xRange)[0]/xRange*elem.width, axies.x-f(xMin+fraction(i+1)*xRange)[1]/yRange*elem.height);	
			}		   		
			context.stroke();
			context.closePath();
			
			return thiz;
		}
	};
	// Apply prototype to constructor
	for( var key in ƒ.p ) {
		ƒ[key] = ƒ.p[key];
	}
	return ƒ;
}());

if( module ) {
	module.exports = ƒ;
}